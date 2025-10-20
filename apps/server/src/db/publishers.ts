import { ServerEvents } from '@sharkord/shared';
import { pubsub } from '../utils/pubsub';
import { getEmojiById } from './queries/emojis/get-emoji-by-id';
import { getMessage } from './queries/messages/get-message';
import { getSettings } from './queries/others/get-settings';
import { getRole } from './queries/roles/get-role';
import { getPublicUserById } from './queries/users/get-public-user-by-id';

const publishMessageUpdate = async (messageId: number | undefined) => {
  if (!messageId) return;

  const message = await getMessage(messageId);

  if (!message) return;

  pubsub.publish(ServerEvents.MESSAGE_UPDATE, message);
};

const publishEmojiUpdate = async (emojiId: number | undefined) => {
  if (!emojiId) return;

  const emoji = await getEmojiById(emojiId);

  if (!emoji) return;

  pubsub.publish(ServerEvents.EMOJI_UPDATE, emoji);
};

const publishEmojiCreate = async (emojiId: number | undefined) => {
  if (!emojiId) return;

  const emoji = await getEmojiById(emojiId);

  if (!emoji) return;

  pubsub.publish(ServerEvents.EMOJI_CREATE, emoji);
};

const publishRole = async (
  roleId: number | undefined,
  type: 'create' | 'update' | 'delete'
) => {
  if (!roleId) return;

  if (type === 'delete') {
    pubsub.publish(ServerEvents.ROLE_DELETE, roleId);
    return;
  }

  const role = await getRole(roleId);

  if (!role) return;

  const targetEvent =
    type === 'create' ? ServerEvents.ROLE_CREATE : ServerEvents.ROLE_UPDATE;

  pubsub.publish(targetEvent, role);
};

const publishUser = async (
  userId: number | undefined,
  type: 'create' | 'update' | 'delete'
) => {
  if (!userId) return;

  if (type === 'delete') {
    pubsub.publish(ServerEvents.USER_DELETE, userId);
    return;
  }

  const user = await getPublicUserById(userId);

  if (!user) return;

  const targetEvent =
    type === 'create' ? ServerEvents.USER_CREATE : ServerEvents.USER_UPDATE;

  pubsub.publish(targetEvent, user);
};

const publishSettings = async () => {
  const settings = await getSettings();

  pubsub.publish(ServerEvents.SERVER_SETTINGS_UPDATE, settings);
};

export {
  publishEmojiCreate,
  publishEmojiUpdate,
  publishMessageUpdate,
  publishRole,
  publishSettings,
  publishUser
};
