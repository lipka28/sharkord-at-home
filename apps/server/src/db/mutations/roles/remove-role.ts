import type { TRole } from '@sharkord/shared';
import { eq } from 'drizzle-orm';
import { db } from '../..';
import { roles } from '../../schema';

const removeRole = async (id: number): Promise<TRole | undefined> =>
  db.delete(roles).where(eq(roles.id, id)).returning().get();

export { removeRole };
