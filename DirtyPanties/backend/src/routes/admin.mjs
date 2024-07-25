import {Router} from "express";
import verifyAdmin from '../middlewares/VerifyAdmin.mjs'

const router = express.Router();

router.get('/api/admin/dashboard', verifyAdmin, (req, res) => {
    // Admin-specific route
    res.json({ message: 'Welcome to the admin dashboard' });
});