import type { Permission, TJoinedRole } from '@sharkord/shared';
import { eq } from 'drizzle-orm';
import { db } from '../..';
import { rolePermissions, roles, users } from '../../schema';

const getUserRole = async (
  userId: number
): Promise<TJoinedRole | undefined> => {
  const role = await db
    .select({ role: roles })
    .from(users)
    .innerJoin(roles, eq(users.roleId, roles.id))
    .where(eq(users.id, userId))
    .get();

  if (!role) return undefined;

  const permissions = await db
    .select({ permission: rolePermissions.permission })
    .from(rolePermissions)
    .where(eq(rolePermissions.roleId, role.role.id));

  return {
    ...role.role,
    permissions: permissions.map((p) => p.permission) as Permission[]
  };
};

export { getUserRole };
