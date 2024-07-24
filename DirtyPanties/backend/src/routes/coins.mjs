import {Router} from "express";
import Stripe from 'stripe'; 
import { STRIPE_PRIVATE_KEY, COINS_TO_USD_RATIO } from "../config/constants.mjs";

const router = Router();
const stripe = new Stripe(`${STRIPE_PRIVATE_KEY}`)

router.post('/api/coins/pay/', async (req,res) => {
    console.log("SESSION BIDS :", req.session)
    const {paymentOrder} = req.body;
    const userId= req.user._id;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: paymentOrder.amount*100,
            currency:  'usd',
            medatada:{
                userId : userId,
            },
        });

    res.status(200).send({
        clientSecret: paymentIntent.client_secret
    })
    }catch(error) {
        console.error('Error creating payment intent:', error);
        res.status(500).send({ error: error.message }); 
    }

} );