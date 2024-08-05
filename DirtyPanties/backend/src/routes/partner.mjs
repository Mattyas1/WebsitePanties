import {Router} from "express";
import "../strategies/local-strategy.mjs";
import User from "../mongoose/schemas/User.mjs"
import { sendEmail } from "../utils/mailsFunction.mjs";
import { hashPassword } from "../utils/hashFunctions.mjs";
import { WEBSITE_URL } from "../config/constants.mjs";
import crypto from 'crypto'

const router = Router();

router.get('/api/partner', async (req, res) => {
    try {
      const partners = await User.find({ role: 'partner' }).select('username _id');
      res.status(200).json(partners);
    } catch (error) {
      console.error('Error fetching partners:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.get('/api/partner/:partnerId', async (req, res) => {
    try {
      // Fetch partner details and populate sellingProducts with Product details
      const partner = await User.findById(req.params.partnerId)
        .select('username sellingProducts')
        .populate({
          path: 'sellingProducts.productId',
          select: 'name images startingPrice bid auctionDate',
        });
  
      if (!partner) {
        return res.status(404).json({ message: 'Partner not found' });
      }
  
      res.status(200).json(partner);
    } catch (error) {
      console.error('Error fetching partner:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.post('/api/users/:userId/subscribe', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { partnerId } = req.body;

    // Ensure the user is authenticated (e.g., check session)
    if (!req.session.userId || req.session.userId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const partner = await User.findById(partnerId).select('username');
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

    // Check if the user is already subscribed to the partner
    if (user.subscribedPartners.some(sp => sp.userId.toString() === partnerId)) {
      return res.status(400).json({ message: 'Already subscribed to this partner' });
    }

    // Add the partner to the user's subscribedPartners
    user.subscribedPartners.push({
      userId: partnerId,
      username: partner.username,
    });

    await user.save();
    
    res.status(200).json({ message: 'Subscribed successfully', subscribedPartners: user.subscribedPartners });
  } catch (error) {
    console.error('Error subscribing to partner:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

  export default router;