import {Router} from "express";
import Product from "../mongoose/schemas/Product.mjs";
import User from "../mongoose/schemas/User.mjs";
import { sendHighestBidUpdate, getClientSubscription } from "../websocket/websocketServer.mjs";
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
         const bid = product.bid;
         const previousBidder = await User.findById(bid.bidderId);
         if (!previousBidder) {
            console.log("Previous Nidder not found")
             return res.status(404).json({ error: 'Previous Bidder not found' });
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

         if (userBid < bid.amount) {
            return res.status(400).json({ error: 'Bid placed too low' });
        }

        previousBidder.coins = previousBidder.coins + product.bid.amount;
        //send him a notification here
        await previousBidder.save();
        const bidDate = new Date();

        const updatedBid = {
            amount: userBid,
            bidderId: userId,
            date : bidDate
        }

        product.bidHistory.push(bid);
        product.bid = updatedBid;
        const updatedProduct = await product.save();

        user.coins = user.coins - userBid;
        const bidHistory = {
            productId: productId,
            productName : product.name,
            bidAmount: userBid,
            bidDate: bidDate
        }
        user.bidHistory.push(bidHistory);
        const updatedUser =await user.save();

        await sendHighestBidUpdate(productId);

        res.status(200).json({ message: 'Bid placed successfully', updatedProduct, updatedUser });
    }catch(error) {
        console.error('Error placing bid:', error);
        res.status(500).json({ error: 'Failed to place bid' });
    }
});

export default router;