import { Permission } from '@sharkord/shared';
import { TRPCError } from '@trpc/server';
import { createRole } from '../../db/mutations/roles/create-role';
import { publishRole } from '../../db/publishers';
import { protectedProcedure } from '../../utils/trpc';

const addRoleRoute = protectedProcedure.mutation(async ({ ctx }) => {
  await ctx.needsPermission(Permission.MANAGE_ROLES);

  const role = await createRole({
    name: 'New Role',
    color: '#ffffff',
    isDefault: false,
    isPersistent: false
  });

  if (!role) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR'
    });
  }

  await publishRole(role.id, 'create');

  return role.id;
});

export { addRoleRoute };
