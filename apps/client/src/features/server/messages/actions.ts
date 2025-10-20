import { store } from '@/features/store';
import type { TJoinedMessage } from '@sharkord/shared';
import { serverSliceActions } from '../slice';

export const addMessages = (
  channelId: number,
  messages: TJoinedMessage[],
  opts: { prepend?: boolean } = {}
) => {
  store.dispatch(serverSliceActions.addMessages({ channelId, messages, opts }));
};

export const updateMessage = (channelId: number, message: TJoinedMessage) => {
  store.dispatch(serverSliceActions.updateMessage({ channelId, message }));
};

export const deleteMessage = (channelId: number, messageId: number) => {
  store.dispatch(serverSliceActions.deleteMessage({ channelId, messageId }));
};
