import type { TIUser } from '@sharkord/shared';
import { eq } from 'drizzle-orm';
import { db } from '../..';
import { users } from '../../schema';

const updateUser = async (
  userId: number,
  user: Partial<TIUser>
): Promise<TIUser | undefined> =>
  db
    .update(users)
    .set({
      ...user,
      updatedAt: Date.now()
    })
    .where(eq(users.id, userId))
    .returning()
    .get();

export { updateUser };
