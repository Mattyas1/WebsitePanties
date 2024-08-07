import User from '../mongoose/schemas/User.mjs';

const verifyAdmin = async (req, res, next) => {
    try {
        const {userId} = req.session
        const user = await User.findById(userId);
        
        if (user && user.role === 'admin') {
            next(); // User is admin, proceed with request
        } else {
            console.log("Non admin tried requesting on admin endpoint", userId)
            res.status(403).json({ message: 'Access denied' });
        }
    } catch (error) {
        console.log("Non logged user tried requesting on admin endpoint")
        res.status(401).json({ message: 'Unauthorized' });
    }
};

export default verifyAdmin;
