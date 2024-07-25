import {Router} from "express";
import Stripe from 'stripe'; 
import { STRIPE_PRIVATE_KEY, WEBSITE_URL } from "../config/constants.mjs";

const router = Router();
const stripe = new Stripe(`${STRIPE_PRIVATE_KEY}`)

router.post('/api/coins/pay', async (req,res) => {
    console.log("SESSION PAY :", req.body)
    try{
        const {coinAmount, price, currency} = req.body;
        const userId= req.session.userId

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: currency,
                        product_data: {
                            name: 'Coins Purchase',
                        },
                        unit_amount: Math.round(price*100),
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
    }catch(error) {
        console.error('Error creating Stripe Checkout session:', error);
        res.status(500).send({ error: error.message }); 
    }

});

export default router;