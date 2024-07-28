import {Router} from "express";
import { AuthValidationSchema } from "../utils/ValidationSchemas.mjs";
import passport from "passport";
import "../strategies/local-strategy.mjs";
import jwt from "jsonwebtoken"
import {checkSchema, validationResult} from "express-validator";
import  User  from "../mongoose/schemas/User.mjs"
import VerifyTokenMiddleware from "../middlewares/VerifyTokenMiddleware.mjs"

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
export const authRouter = Router();
export const routerWithoutSession = Router();


authRouter.post("/api/auth", checkSchema(AuthValidationSchema), (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    passport.authenticate('local', (err, result) => {
      if (err) {
        return res.status(401).json({ message: err.message });
      }
  
      const {user, accessToken, refreshToken } = result;
      req.session.userId = user._id;
      res.status(201).json({user, accessToken, refreshToken });
      
    })(req, res, next);
});

authRouter.post('/api/auth/refreshToken', async (req, res) => {
  console.log("Refresh token")
    const { refreshToken } = req.body;
  
    if (!refreshToken) return res.status(403).send({ message: 'No token provided.' });
  
    try {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
      const user = await User.findOne({ _id: decoded.id, refreshToken });
      
  
      if (!user) {
        console.log('Invalid refresh token.')
        return res.status(403).send({ message: 'Invalid refresh token.' })
      };
  
      const accessToken = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '2h' });
  
      res.json({ accessToken });
    } catch (err) {
        console.log('Unauthorized')
      res.status(401).send({ message: 'Unauthorized.' });
    }
  });

  authRouter.get('/api/auth/verifyToken', VerifyTokenMiddleware,async  (req, res) => {
    const user = await User.findById(req.userId);
    req.session.userId = user._id;
    res.status(200).json({message : "Token Verified", user});
  });
  
