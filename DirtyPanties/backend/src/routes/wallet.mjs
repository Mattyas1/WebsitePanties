import {Router} from "express";
import Stripe from 'stripe'; 
import { WEBSITE_URL } from "../config/constants.mjs";
import RefundRequest from "../mongoose/schemas/RefundRequest.mjs";
import User from "../mongoose/schemas/User.mjs";

const STRIPE_PRIVATE_KEY = process.env.STRIPE_PRIVATE_KEY;
const router = Router();
const stripe = new Stripe(`${STRIPE_PRIVATE_KEY}`)

router.post('/api/wallet/recharge', async (req, res) => {
    console.log("SESSION RECHARGE:", req.body);
    try {
        const { amount, currency } = req.body;
        const userId = req.session.userId;

        if (!userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: currency,
                        product_data: {
                            name: 'Wallet Recharge',
                            description: `Recharge Wallet with $${amount}`,
                        },
                        unit_amount: Math.round(amount * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${WEBSITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${WEBSITE_URL}/cancel`,
            metadata: {
                userId: userId,
            },
        });

        res.status(200).json({ id: session.id });
    } catch (error) {
        console.error('Error creating Stripe Checkout session:', error);
        res.status(500).send({ error: error.message });
    }
});

router.post('/api/wallet/refund', async (req, res) => {
    try {
      const { userId, amount, iban, bic, accountHolderName, accountHolderAddress, bankName, bankAddress } = req.body;
  
      if (!userId || !amount || !iban || !bic || !accountHolderName || !accountHolderAddress || !bankName || !bankAddress) {
        return res.status(400).json({ error: 'All fields are required' });
      }
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      if (amount <= 0) {
        return res.status(400).json({ error: 'Refund amount must be greater than zero' });
      }
  
      if (amount > user.wallet.amount) {
        return res.status(400).json({ error: 'Refund amount exceeds wallet balance' });
      }
  
      // Create a new refund application
      const refundApplication = new RefundRequest({
        userId,
        amount,
        iban,
        bic,
        accountHolderName,
        accountHolderAddress,
        bankName,
        bankAddress,
      });
  
      // Save the refund application to the database
      await refundApplication.save();
  
      // Update the user's wallet amount
      user.wallet.amount -= amount;
      await user.save();
  
      res.status(201).json({ message: 'Refund request submitted successfully', updatedWallet : user.wallet });
    } catch (error) {
      console.error('Error submitting refund request:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/api/wallet/refund', async (req, res) => {
    try {
      const userId = req.session.userId;
      const requests = await RefundRequest.find({ userId });
  
      if (requests.length > 0) {
        res.status(200).json(requests);
      } else {
        res.status(204).send(); // No content
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


export default router;