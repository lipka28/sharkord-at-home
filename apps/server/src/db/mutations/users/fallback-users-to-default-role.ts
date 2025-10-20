import { eq } from 'drizzle-orm';
import { db } from '../..';
import { getDefaultRole } from '../../queries/roles/get-default-role';
import { users } from '../../schema';

const fallbackUsersToDefaultRole = async (roleId: number) => {
  const defaultRole = await getDefaultRole();

  if (!defaultRole) {
    throw new Error('Default role not found');
  }

  await db.transaction(async (tx) => {
    await tx
      .update(users)
      .set({
        roleId: defaultRole?.id,
        updatedAt: Date.now()
      })
      .where(eq(users.roleId, roleId));
  });
};

export { fallbackUsersToDefaultRole };
