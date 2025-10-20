import type { Permission, TJoinedRole } from '@sharkord/shared';
import { sql } from 'drizzle-orm';
import { db } from '../..';
import { rolePermissions, roles } from '../../schema';

const getRole = async (roleId: number): Promise<TJoinedRole | undefined> => {
  const role = await db
    .select({
      id: roles.id,
      name: roles.name,
      color: roles.color,
      isPersistent: roles.isPersistent,
      isDefault: roles.isDefault,
      createdAt: roles.createdAt,
      updatedAt: roles.updatedAt,
      permissions:
        sql<string>`group_concat(${rolePermissions.permission}, ',')`.as(
          'permissions'
        )
    })
    .from(roles)
    .leftJoin(rolePermissions, sql`${roles.id} = ${rolePermissions.roleId}`)
    .where(sql`${roles.id} = ${roleId}`)
    .groupBy(roles.id)
    .limit(1)
    .get();

  if (!role) return undefined;

  return {
    ...role,
    permissions: role.permissions
      ? (role.permissions.split(',') as Permission[])
      : []
  };
};

export { getRole };
