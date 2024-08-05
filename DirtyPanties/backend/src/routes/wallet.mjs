import {Router} from "express";
import Stripe from 'stripe'; 
import { WEBSITE_URL } from "../config/constants.mjs";

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


export default router;