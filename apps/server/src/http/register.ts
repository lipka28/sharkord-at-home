import { sha256 } from '@sharkord/shared';
import http from 'http';
import z from 'zod';
import { createUser } from '../db/mutations/users/create-user';
import { publishUser } from '../db/publishers';
import { getSettings } from '../db/queries/others/get-settings';
import { getUserByIdentity } from '../db/queries/users/get-user-by-identity';
import { getJsonBody } from './helpers';
import { HttpValidationError } from './utils';

const zBody = z.object({
  identity: z.string(),
  password: z.string().min(4),
  inviteCode: z.string().optional()
});

const registerRouteHandler = async (
  req: http.IncomingMessage,
  res: http.ServerResponse
) => {
  const settings = await getSettings();
  const data = zBody.parse(await getJsonBody(req));

  if (!settings.allowNewUsers) {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Registration is disabled' }));
    return res;
  }

  const existingUser = await getUserByIdentity(data.identity);

  if (existingUser) {
    throw new HttpValidationError('identity', 'Identity already taken');
  }

  const hashedPassword = await sha256(data.password);
  const createdUser = await createUser(data.identity, hashedPassword);

  await publishUser(createdUser.id, 'create');

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ success: true }));

  return res;
};

export { registerRouteHandler };
