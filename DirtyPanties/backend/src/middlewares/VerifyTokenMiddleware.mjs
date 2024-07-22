import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/constants.mjs';

const VerifyTokenMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(403).send({ message: 'No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {

    if (err) {
      return res.status(401).send({ message: 'Unauthorized.' });
    }
    req.userId = decoded.id;
    next();
  });
};

export default VerifyTokenMiddleware;
