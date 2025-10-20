import type { TMessage } from '@sharkord/shared';
import { eq } from 'drizzle-orm';
import { db } from '../..';
import { messages } from '../../schema';

const getRawMessage = async (
  messageId: number
): Promise<TMessage | undefined> => {
  const message = await db
    .select()
    .from(messages)
    .where(eq(messages.id, messageId))
    .limit(1)
    .get();

  return message;
};

export { getRawMessage };
