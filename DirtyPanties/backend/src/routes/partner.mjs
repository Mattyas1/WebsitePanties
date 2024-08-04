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

  export default router;