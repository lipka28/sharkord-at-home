import type { TChannel } from '@sharkord/shared';
import { eq } from 'drizzle-orm';
import { db } from '../..';
import { channels } from '../../schema';

const removeChannel = async (
  channelId: number
): Promise<TChannel | undefined> =>
  db.delete(channels).where(eq(channels.id, channelId)).returning().get();

export { removeChannel };
