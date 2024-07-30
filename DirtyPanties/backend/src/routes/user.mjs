import {Router} from "express";
import "../strategies/local-strategy.mjs";
import User from "../mongoose/schemas/User.mjs"
import { sendEmail } from "../utils/mailsFunction.mjs";
import { hashPassword } from "../utils/hashFunctions.mjs";
import { WEBSITE_URL } from "../config/constants.mjs";
import crypto from 'crypto'

const router = Router();

router.post("/api/user/getUsername", async (req,res) => {
    console.log("SESSION USER :", req.session)
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
  })
export default router;