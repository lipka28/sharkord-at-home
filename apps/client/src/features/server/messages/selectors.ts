import type { IRootState } from '@/features/store';
import { createSelector } from '@reduxjs/toolkit';

export const messagesMapSelector = (state: IRootState) =>
  state.server.messagesMap;

export const messagesByChannelIdSelector = createSelector(
  [messagesMapSelector, (_, channelId: number) => channelId],
  (messagesMap, channelId) => messagesMap[channelId] || []
);
