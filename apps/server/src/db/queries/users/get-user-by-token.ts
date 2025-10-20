import jwt from 'jsonwebtoken';
import { SERVER_PRIVATE_TOKEN } from '../..';
import type { TTokenPayload } from '../../../types';
import { getUserById } from './get-user-by-id';

const getUserByToken = async (token: string | undefined) => {
  if (!token) return undefined;

  const decoded = jwt.verify(token, SERVER_PRIVATE_TOKEN) as TTokenPayload;

  const user = await getUserById(decoded.userId);

  return user;
};

export { getUserByToken };
