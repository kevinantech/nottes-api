import jwt from 'jsonwebtoken';

export class JwtUtil {
  static sign<T extends {}>(payload: T, secret: string, expiration: string) {
    return jwt.sign(payload, secret, { expiresIn: expiration });
  }
}
