import type { Permission, TJoinedRole } from '@sharkord/shared';
import { sql } from 'drizzle-orm';
import { db } from '../..';
import { rolePermissions, roles } from '../../schema';

const getRoles = async (): Promise<TJoinedRole[]> => {
  const results = await db
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
    .groupBy(roles.id);

  return results.map((role) => ({
    ...role,
    permissions: role.permissions
      ? (role.permissions.split(',') as Permission[])
      : []
  }));
};

export { getRoles };
