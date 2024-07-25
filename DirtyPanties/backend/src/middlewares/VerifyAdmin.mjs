import jwt from 'jsonwebtoken';
import User from '../mongoose/schemas/User.mjs';

const verifyAdmin = async (req, res, next) => {
    try {
        const {userId} = req.session
        const user = await User.findById(decoded.userId);
        
        if (user && user.role === 'admin') {
            next(); // User is admin, proceed with request
        } else {
            res.status(403).json({ message: 'Access denied' });
        }
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

export default verifyAdmin;
