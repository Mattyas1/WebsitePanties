import express from 'express'
import Stripe from 'stripe'; 
import User from '../mongoose/schemas/User.mjs'

const STRIPE_PRIVATE_KEY = process.env.STRIPE_PRIVATE_KEY;
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const router = express.Router();
const stripe = new Stripe(`${STRIPE_PRIVATE_KEY}`)


router.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error(`⚠️  Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        await handleCheckoutSession(session);
    }

    res.status(200).end();
});

const handleCheckoutSession = async (session) => {
    const { userId } = session.metadata;

    try {
        const user = await User.findById(userId);

        if (!user) {
            console.error(`User not found: ${userId}`);
            return;
        }

        const amount = session.amount_total / 100;
        user.wallet.amount += amount;
        await user.save();

        console.log(`User ${userId} wallet updated with amount: $${amount}`);
    } catch (error) {
        console.error('Error updating user wallet:', error);
    }
};

export default router