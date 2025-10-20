import type { TChannel } from '@sharkord/shared';
import { eq } from 'drizzle-orm';
import { db } from '../..';
import { channels } from '../../schema';

const getChannel = async (channelId: number): Promise<TChannel | undefined> =>
  db.select().from(channels).where(eq(channels.id, channelId)).get();

export { getChannel };
