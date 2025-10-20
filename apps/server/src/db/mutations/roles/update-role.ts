import type { TRole } from '@sharkord/shared';
import { eq } from 'drizzle-orm';
import { db } from '../..';
import { roles } from '../../schema';

const updateRole = async (
  id: number,
  updates: Partial<TRole>
): Promise<TRole | undefined> =>
  db
    .update(roles)
    .set({
      ...updates,
      updatedAt: Date.now()
    })
    .where(eq(roles.id, id))
    .returning()
    .get();

export { updateRole };
