import type { TIMessage } from '@sharkord/shared';
import { db } from '../..';
import { messages } from '../../schema';

const createMessage = async (message: TIMessage) =>
  db.insert(messages).values(message).returning().get();

export { createMessage };
