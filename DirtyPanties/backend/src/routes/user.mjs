import {Router} from "express";
import "../strategies/local-strategy.mjs";
import User from "../mongoose/schemas/User.mjs"
import Product from "../mongoose/schemas/Product.mjs";
import { sendEmail } from "../utils/mailsFunction.mjs";
import { hashPassword } from "../utils/hashFunctions.mjs";
import { WEBSITE_URL } from "../config/constants.mjs";
import crypto from 'crypto'

const router = Router();

router.post("/api/user/getUsername", async (req,res) => {
    try {
        const findUser = await User.findById(req.body.id);

        if (!findUser) {
            return res.status(404).send({ message: 'User not found' });
        }

        return res.status(201).send({username : findUser.username});
    } catch (err) {
        console.error("Error fetching username:", err);
        return res.status(500).send({ message: 'Internal Server Error' })
    }
});

router.post('/api/user/resetPassword', async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        console.log("User not Found")
        return res.status(404).json({ message: 'Email not found' });
      }
      // Generate a reset token
      const token = crypto.randomBytes(20).toString('hex');
  
      // Set the token and its expiration time in the user's document
      user.resetPassword.token = token;
      user.resetPassword.expires = Date.now() + 3600000; // 1 hour
  
      await user.save();
  
      // Generate the reset link
      const resetLink = `${WEBSITE_URL}/NewPassword/${token}`;
      console.log("ULink sent : ", resetLink)
  
      // Send the password reset email
      await sendEmail(email, 'Password Reset', `Click the following link to reset your password: ${resetLink}`);
  
      res.status(200).json({ message: 'Password reset link sent' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  router.post('/api/user/resetPassword/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
  
    try {
      const user = await User.findOne({
        'resetPassword.token': token,
        'resetPassword.expires': { $gt: Date.now() } // Check if the token is still valid
      });
  
      if (!user) {
        return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
      };
  
      // Update the user's password
      user.password = await hashPassword(password); 
      user.resetPassword = { token: undefined, expires: undefined };
  
      await user.save();
  
      res.status(200).json({ message: 'Password has been reset' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.get('/api/user/settings', async (req,res)=> {
    try {
      const userId = req.session.userId;
  
      const user = await User.findById(userId).select('settings');
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const userSettings = user.settings;
      res.status(200).json(userSettings);
    } catch (error) {
      console.error('Error updating user settings:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  })

  router.put('/api/user/settings',async (req,res) => {
    try {
      const userId = req.session.userId;
      const { language, notifications, emailUpdates } = req.body;
  
      const updatedSettings = {
        settings: {
          language,
          notifications,
          emailUpdates,
        },
      };
  
      const user = await User.findByIdAndUpdate(userId, updatedSettings, { new: true });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error('Error updating user settings:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.get('/api/user/:userId', async (req,res) => {

    const {userId} = req.params;

    if (!req.session.userId || req.session.userId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    };

    try {
      const user = await  User.findById(userId)
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
      res.status(200).json(user);
      
    } catch (error) {
      console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
    }
  });

  router.post('/api/user/:userId/favorite', async (req,res) => {
    const {productId} = req.body;
    const {userId} = req.params;

    if (!req.session.userId || req.session.userId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    };

    try {
      const user = await  User.findById(userId)
      if (!user) {
        return res.status(400).json({ message: 'User not found to add for favorite' });
      };
      const product = await  Product.findById(productId)
      if (!product) {
        return res.status(400).json({ message: 'Product not found to add for favorite' });
      };
      const productIndex = user.favoriteProducts.findIndex(
        (fav) => fav.productId.toString() === productId
      );
      if (productIndex > -1) {
        // Remove from favorites
        user.favoriteProducts.splice(productIndex, 1);
      } else {
        // Add to favorites
        user.favoriteProducts.push({ productId, productName: `${product.name}` });
      };
      await user.save();

    // Respond with only the updated favoriteProducts array
    res.json({ favoriteProducts: user.favoriteProducts });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  });

  router.get('/api/user/:userId/favorites', async (req, res) => {
    try {
      const userId = req.params.userId;
      if (!req.session.userId || req.session.userId !== userId) {
        return res.status(403).json({ message: 'Access denied' });
      };

      const user = await User.findById(userId).select('favoriteProducts').populate('favoriteProducts.productId');
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const products = user.favoriteProducts.map(fav => fav.productId);
      // Respond with the list of products
      res.json(products);
    } catch (error) {
      console.error('Error fetching favorite products:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });



  router.post('/api/user/:userId/subscribe', async (req, res) => {
    const { partnerId } = req.body;
    const { userId } = req.params;

    // Ensure the user is authenticated and authorized
    if (!req.session.userId || req.session.userId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    try {
      // Find the user and partner
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const partner = await User.findById(partnerId).select('username');
      if (!partner) {
        return res.status(404).json({ message: 'Partner not found' });
      }

      // Check if the user is already subscribed to the partner
      const subscriptionIndex = user.subscribedPartners.findIndex(
        (sub) => sub.userId.toString() === partnerId
      );

      if (subscriptionIndex > -1) {
        // If already subscribed, remove the subscription
        user.subscribedPartners.splice(subscriptionIndex, 1);
      } else {
        // Otherwise, add the subscription
        user.subscribedPartners.push({
          userId: partnerId,
          username: partner.username
        });
    }

    await user.save();

    // Respond with the updated subscribedPartners array
    res.json({ subscribedPartners: user.subscribedPartners });
  } catch (error) {
    console.error('Error subscribing to partner:', error);
    res.status(500).json({ message: 'Server error', error });
  }
  });

  router.get('/api/user/:userId/subscriptions', async (req, res) => {
    try {
      const userId = req.params.userId;
  
      if (!req.session.userId || req.session.userId !== userId) {
        return res.status(403).json({ message: 'Access denied' });
      }
  
      const user = await User.findById(userId)
        .select('subscribedPartners')
        .populate({
          path: 'subscribedPartners.userId',
          select: 'username email', // Select only specific fields
        });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const subscribedPartners = user.subscribedPartners.map(sub => sub.userId);
  
      res.json(subscribedPartners);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

router.get('/api/user/:userId/history', async (req, res) => {
  const { userId } = req.params;

  if (!req.session.userId || req.session.userId !== userId) {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const user = await User.findById(userId).select('bidHistory winHistory');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ bidHistory: user.bidHistory, winHistory: user.winHistory });
  } catch (error) {
    console.error('Error fetching user history:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



export default router;