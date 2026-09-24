import jwt from 'jsonwebtoken';
import 'dotenv/config';

const verifyToken = (token: string | undefined) => {
  if (token) {
    try {
      const userPayload = jwt.verify(token, <string>process.env.SECRET);
      return userPayload;
    } catch (e) {
      console.log();
    }
  }
  return;
};
export { verifyToken };

