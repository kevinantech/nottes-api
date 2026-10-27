import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { AppException } from '../core/shared/domain/exception';
import { UserRole } from '../core/user/domain/role.enum';

export interface UserPayload {
  id: string;
  role: UserRole;
  name: string;
  email: string;
}

export interface Context {
  user: UserPayload | null;
}

const validateToken = (token?: string) => {
  if (!token) return null;

  try {
    const payload = jwt.verify(token, <string>process.env.JWT_SECRET);
    return payload;
  } catch (e) {
    throw new AppException('Sesión no válida', 401);
  }
};
export { validateToken };

