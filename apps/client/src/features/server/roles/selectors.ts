import type { IRootState } from '@/features/store';
import { createSelector } from '@reduxjs/toolkit';

export const rolesSelector = (state: IRootState) => state.server.roles;

export const roleByIdSelector = createSelector(
  [rolesSelector, (_, roleId: number) => roleId],
  (roles, roleId) => roles.find((role) => role.id === roleId)
);
