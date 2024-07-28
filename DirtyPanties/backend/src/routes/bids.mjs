import {Router} from "express";
import Product from "../mongoose/schemas/Product.mjs";
import User from "../mongoose/schemas/User.mjs";
import { placeBid } from "../utils/bidsFunctions.mjs";

const router = Router();

router.post('/api/bids/place', async (req,res) => {
    const {productId, userBid} = req.body;
    const {userId} = req.session;

    try{
         // Find the product by ID
         const product = await Product.findById(productId);
         if (!product) {
             return res.status(404).json({ error: 'Product not found' });
         }
 
         // Find the user
         const user = await User.findById(userId);
         if (!user) {
             return res.status(404).json({ error: 'User not found' });
         }
 
         // Check if user has enough coins
         if (user.coins < userBid) {
             return res.status(400).json({ error: 'Insufficient coins' });
         };

         if (userBid < product.bid.amount) {
            return res.status(400).json({ error: 'Bid placed too low' });
        }

        const updatedBid = {
            amount: userBid,
            bidderId: userId,
            date : new Date()
         }
         product.bid = updatedBid;
        user.coins = user.coins - userBid;
        const updatedProduct = await product.save();
        const updatedUser =await user.save();

        res.status(200).json({ message: 'Bid placed successfully', updatedProduct, updatedUser });
    }catch(error) {
        console.error('Error placing bid:', error);
        res.status(500).json({ error: 'Failed to place bid' });
    }
});

export default router;