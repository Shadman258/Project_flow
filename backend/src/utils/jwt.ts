import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const signToken = (userId: string): string => {
  return jwt.sign({ userId }, env.jwtSecret, { expiresIn: '7d' });
};
