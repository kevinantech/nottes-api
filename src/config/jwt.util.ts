import jwt from 'jsonwebtoken';

type UserPayload = {
  id: string;
  email: string;
};

const signUserToken = (
  payload: UserPayload,
  secret: string,
  expiration: string,
) => {
  return jwt.sign(payload, secret, { expiresIn: expiration });
};

export { signUserToken };
