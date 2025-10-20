import type { TMessage } from '@sharkord/shared';
import { eq } from 'drizzle-orm';
import { db } from '../..';
import { messages } from '../../schema';

const removeMessage = async (
  messageId: number
): Promise<TMessage | undefined> =>
  db.delete(messages).where(eq(messages.id, messageId)).returning().get();

export { removeMessage };
