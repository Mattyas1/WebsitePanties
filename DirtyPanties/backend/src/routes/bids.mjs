import {Router} from "express";
import Product from "../mongoose/schemas/Product.mjs";
import User from "../mongoose/schemas/User.mjs";
import { sendHighestBidUpdate } from "../websocket/websocketServer.mjs";
const router = Router();

router.post('/api/bids/place', async (req,res) => {
    const {productId, userBid} = req.body;
    const {userId} = req.session;
    if (!userId) {
        return res.status(401).json({ error: 'User is not authenticated' });
    }

    try{
         // Find the product by ID
         const product = await Product.findById(productId);
         if (!product) {
             return res.status(404).json({ error: 'Product not found' });
         };
         const bid = product.bid;
         const endDate = product.auctionDate;
         if (new Date()> endDate) {
            console.log("Bid tried on an ended auction0");
            return res.status(404).json({ error: 'Auction is already finished' });
         };

         let previousBidder
         if(bid){
            console.log("HERE DEFINED")
            previousBidder = await User.findById(bid.bidderId);
            if (!previousBidder) {
                console.log("Previous Bidder not found")
                return res.status(404).json({ error: 'Previous Bidder not found' });
            }
         }
         
 
         // Find the user
         let user = await User.findById(userId);
         if (!user) {
             return res.status(404).json({ error: 'User not found' });
         }
 
         // Check if user has enough balance in the wallet 
         if (user.wallet.amount < userBid) {
             return res.status(400).json({ error: 'Insufficient balance in your wallet' });
         };

         if (userBid < (bid? bid.amount : product.startingPrice)) {
            return res.status(400).json({ error: 'Bid placed too low' });
        }

        if (bid) {
            previousBidder.wallet.amount = previousBidder.wallet.amount + product.bid.amount;
            //send him a notification here
            await previousBidder.save();
            if (toString(user._id) === toString(previousBidder._id)){
                user = await User.findById(userId);
            }
        }
        const bidDate = new Date();

        const updatedBid = {
            amount: userBid,
            bidderId: userId,
            date : bidDate
        }

        product.bidHistory.push(bid);
        product.bid = updatedBid;
        const updatedProduct = await product.save();

        user.wallet.amount = user.wallet.amount - userBid;
        const bidHistory = {
            productId: productId,
            productName : product.name,
            bidAmount: userBid,
            bidDate: bidDate
        }
        user.bidHistory.push(bidHistory);
        await user.save();
        await sendHighestBidUpdate(productId);
        const updatedUser = await User.findById(userId);

        res.status(200).json({ message: 'Bid placed successfully', updatedProduct, updatedUser });
    }catch(error) {
        console.error('Error placing bid:', error);
        res.status(500).json({ error: 'Failed to place bid' });
    }
});

export default router;