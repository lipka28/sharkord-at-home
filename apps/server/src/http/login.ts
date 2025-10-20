import { sha256 } from '@sharkord/shared';
import http from 'http';
import jwt from 'jsonwebtoken';
import z from 'zod';
import { SERVER_PRIVATE_TOKEN } from '../db';
import { getUserByIdentity } from '../db/queries/users/get-user-by-identity';
import { getJsonBody } from './helpers';
import { HttpValidationError } from './utils';

const zBody = z.object({
  identity: z.string(),
  password: z.string()
});

const loginRouteHandler = async (
  req: http.IncomingMessage,
  res: http.ServerResponse
) => {
  const data = zBody.parse(await getJsonBody(req));
  const existingUser = await getUserByIdentity(data.identity);

  if (!existingUser) {
    throw new HttpValidationError('identity', 'Identity not found');
  }

  const hashedPassword = await sha256(data.password);
  const passwordMatches = existingUser.password === hashedPassword;

  if (!passwordMatches) {
    throw new HttpValidationError('password', 'Invalid password');
  }

  const token = jwt.sign({ userId: existingUser.id }, SERVER_PRIVATE_TOKEN, {
    expiresIn: '31536000s' // 1 year
  });

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ success: true, token }));

  return res;
};

export { loginRouteHandler };
