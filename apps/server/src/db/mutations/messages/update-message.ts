import type { TIMessage, TMessage } from '@sharkord/shared';
import { eq } from 'drizzle-orm';
import { db } from '../..';
import { messages } from '../../schema';

const updateMessage = async (
  messageId: number,
  message: Partial<TIMessage>
): Promise<TMessage | undefined> =>
  db
    .update(messages)
    .set({
      ...message,
      updatedAt: Date.now()
    })
    .where(eq(messages.id, messageId))
    .returning()
    .get();

export { updateMessage };
