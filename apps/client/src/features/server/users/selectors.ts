import type { IRootState } from '@/features/store';
import { createSelector } from '@reduxjs/toolkit';
import { UserStatus } from '@sharkord/shared';

const STATUS_ORDER: Record<string, number> = {
  online: 0,
  idle: 1,
  offline: 2
};

export const usersSelector = createSelector(
  (state: IRootState) => state.server.users,
  (users) => {
    return [...users].sort((a, b) => {
      const aStatus = STATUS_ORDER[a.status ?? UserStatus.OFFLINE] ?? 3;
      const bStatus = STATUS_ORDER[b.status ?? UserStatus.OFFLINE] ?? 3;

      if (aStatus !== bStatus) {
        return aStatus - bStatus;
      }

      return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
    });
  }
);

export const ownUserSelector = (state: IRootState) => state.server.ownUser;

export const ownUserIdSelector = (state: IRootState) =>
  state.server.ownUser?.id;

export const userByIdSelector = createSelector(
  [usersSelector, (_, userId: number) => userId],
  (users, userId) => users.find((user) => user.id === userId)
);

export const isOwnUserSelector = (state: IRootState, userId: number) =>
  state.server.ownUser?.id === userId;

export const ownPublicUserSelector = createSelector(
  [ownUserIdSelector, usersSelector],
  (ownUserId, users) => users.find((user) => user.id === ownUserId)
);
