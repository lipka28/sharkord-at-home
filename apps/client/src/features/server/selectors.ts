import { createSelector } from '@reduxjs/toolkit';
import type { IRootState } from '../store';
import { rolesSelector } from './roles/selectors';
import { ownUserSelector, userByIdSelector } from './users/selectors';

export const connectedSelector = (state: IRootState) => state.server.connected;

export const connectingSelector = (state: IRootState) =>
  state.server.connecting;

export const serverNameSelector = (state: IRootState) =>
  state.server.settings?.name;

export const serverIdSelector = (state: IRootState) =>
  state.server.settings?.serverId;

export const serverSettingsSelector = (state: IRootState) =>
  state.server.settings;

export const infoSelector = (state: IRootState) => state.server.info;

export const ownUserRoleSelector = createSelector(
  [ownUserSelector, rolesSelector],
  (ownUser, roles) => roles.find((role) => role.id === ownUser?.roleId)
);

export const userRoleSelector = createSelector(
  [rolesSelector, userByIdSelector],
  (roles, user) => roles.find((role) => role.id === user?.roleId)
);
