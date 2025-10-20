import { OWNER_ROLE_ID, Permission } from '@sharkord/shared';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { syncRolePermissions } from '../../db/mutations/roles/sync-role-permissions';
import { updateRole } from '../../db/mutations/roles/update-role';
import { publishRole } from '../../db/publishers';
import { protectedProcedure } from '../../utils/trpc';

const updateRoleRoute = protectedProcedure
  .input(
    z.object({
      roleId: z.number().min(1),
      name: z.string().min(1).max(24),
      color: z
        .string()
        .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color'),
      permissions: z.enum(Permission).array()
    })
  )
  .mutation(async ({ ctx, input }) => {
    await ctx.needsPermission(Permission.MANAGE_ROLES);

    const updatedRole = await updateRole(input.roleId, {
      name: input.name,
      color: input.color
    });

    if (!updatedRole) {
      throw new TRPCError({
        code: 'NOT_FOUND'
      });
    }

    if (updatedRole.id !== OWNER_ROLE_ID) {
      await syncRolePermissions(updatedRole.id, input.permissions);
    }

    await publishRole(updatedRole.id, 'update');
  });

export { updateRoleRoute };
