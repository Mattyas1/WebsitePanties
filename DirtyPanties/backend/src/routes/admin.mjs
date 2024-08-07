import {Router} from "express";
import RefundRequest from "../mongoose/schemas/RefundRequest.mjs";
import User from "../mongoose/schemas/User.mjs";
import verifyAdmin from '../middlewares/VerifyAdmin.mjs'

const router = Router();
router.use(verifyAdmin);

router.get('/api/admin/dashboard', (req, res) => {
    // Admin-specific route
    res.json({ message: 'Welcome to the admin dashboard' });
});

router.get('/api/admin/refundrequests', async (req, res) => {
    try {
      const requests = await RefundRequest.find(); // Modify if you want to filter based on some criteria
      res.status(200).json(requests);
    } catch (error) {
      console.error('Error fetching refund requests:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.get('/api/admin/users', async (req, res) => {
    try {
      const users = await User.find({ role: 'user' }).select('username email wallet.amount');
      console.log(users)
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.get('/api/admin/users/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Fetch user by ID, excluding the password field
      const user = await User.findById(userId)
        .select('-password') // Exclude password field
        .populate('bidHistory.productId', 'name') // Optional: Populate product name in bid history
        .populate('winHistory.productId', 'name'); // Optional: Populate product name in win history
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
export default router;