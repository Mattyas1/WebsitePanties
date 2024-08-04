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
      console.log("User Found: ", user);
      // Generate a reset token
      const token = crypto.randomBytes(20).toString('hex');
      console.log("Reset Token : ", token);
  
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
      console.log("USER:", user)
  
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

  router.post('/api/user/favorite/:userId', async (req,res) => {
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

  router.get('/api/users/:userId/favorites', async (req, res) => {
    try {
      console.log(req.session)
      const userId = req.params.userId;
      if (!req.session.userId || req.session.userId !== userId) {
        return res.status(403).json({ message: 'Access denied' });
      };

      const user = await User.findById(userId).select('favoriteProducts').populate('favoriteProducts.productId');
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Extract product IDs from favoriteProducts
      const favoriteProductIds = user.favoriteProducts.map(fav => fav.productId._id);
  
      const products = await Product.find({ _id: { $in: favoriteProductIds } });
  
      // Respond with the list of products
      res.json(products);
    } catch (error) {
      console.error('Error fetching favorite products:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

export default router;