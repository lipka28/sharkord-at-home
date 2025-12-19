import { ChannelPermission, ServerEvents } from '@sharkord/shared';
import { eq } from 'drizzle-orm';
import { db } from '.';
import { pubsub } from '../utils/pubsub';
import { getAllChannelUserPermissions } from './queries/channels';
import { getEmojiById } from './queries/emojis';
import { getMessage } from './queries/messages';
import { getRole } from './queries/roles';
import { getSettings } from './queries/server';
import { getPublicUserById } from './queries/users';
import { categories, channels, userRoles } from './schema';

const publishMessage = async (
  messageId: number | undefined,
  channelId: number | undefined,
  type: 'update' | 'delete'
) => {
  if (!messageId || !channelId) return;

  if (type === 'delete') {
    pubsub.publish(ServerEvents.MESSAGE_DELETE, {
      messageId: messageId,
      channelId: channelId
    });

    return;
  }

  const message = await getMessage(messageId);

  if (!message) return;

  pubsub.publish(ServerEvents.MESSAGE_UPDATE, message);
};

const publishEmoji = async (
  emojiId: number | undefined,
  type: 'create' | 'update' | 'delete'
) => {
  if (!emojiId) return;

  if (type === 'delete') {
    pubsub.publish(ServerEvents.EMOJI_DELETE, emojiId);
    return;
  }

  const emoji = await getEmojiById(emojiId);

  if (!emoji) return;

  const targetEvent =
    type === 'create' ? ServerEvents.EMOJI_CREATE : ServerEvents.EMOJI_UPDATE;

  pubsub.publish(targetEvent, emoji);
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

const publishChannel = async (
  channelId: number | undefined,
  type: 'create' | 'update' | 'delete'
) => {
  if (!channelId) return;

  if (type === 'delete') {
    pubsub.publish(ServerEvents.CHANNEL_DELETE, channelId);
    return;
  }

  const channel = await db
    .select()
    .from(channels)
    .where(eq(channels.id, channelId))
    .get();

  if (!channel) return;

  const targetEvent =
    type === 'create'
      ? ServerEvents.CHANNEL_CREATE
      : ServerEvents.CHANNEL_UPDATE;

  pubsub.publish(targetEvent, channel);
};

const publishSettings = async () => {
  const settings = await getSettings();

  pubsub.publish(ServerEvents.SERVER_SETTINGS_UPDATE, settings);
};

const publishCategory = async (
  categoryId: number | undefined,
  type: 'create' | 'update' | 'delete'
) => {
  if (!categoryId) return;

  if (type === 'delete') {
    pubsub.publish(ServerEvents.CATEGORY_DELETE, categoryId);
    return;
  }

  const category = await db
    .select()
    .from(categories)
    .where(eq(categories.id, categoryId))
    .get();

  if (!category) return;

  const targetEvent =
    type === 'create'
      ? ServerEvents.CATEGORY_CREATE
      : ServerEvents.CATEGORY_UPDATE;

  pubsub.publish(targetEvent, category);
};

const publishChannelPermissions = async (
  channelId: number,
  {
    targetUserId,
    targetRoleId
  }: {
    targetUserId?: number;
    targetRoleId?: number;
  }
) => {
  const channel = await db
    .select()
    .from(channels)
    .where(eq(channels.id, channelId))
    .get();

  if (!channel) return;

  const affectedUserIds: number[] = [];

  if (targetRoleId) {
    // role permissions changed, need to find all users with that role and notify them
    const usersWithRole = await db
      .select({
        userId: userRoles.userId
      })
      .from(userRoles)
      .where(eq(userRoles.roleId, targetRoleId));

    affectedUserIds.push(...usersWithRole.map((u) => u.userId));
  } else if (targetUserId) {
    // user-specific permissions changed, notify only that user
    affectedUserIds.push(targetUserId);
  }

  for (const userId of affectedUserIds) {
    // this is kinda inefficient because it does more than needed, but I don't feel like changing this shit right now
    const updatedPermissions = await getAllChannelUserPermissions(userId);

    pubsub.publishFor(
      userId,
      ServerEvents.CHANNEL_PERMISSIONS_UPDATE,
      updatedPermissions
    );

    const viewChannelPermission =
      updatedPermissions[channelId]?.permissions[
        ChannelPermission.VIEW_CHANNEL
      ] ?? false;

    // TODO: in this case publishFor is not working. probably all channel events need to be pubsub.subscribeFor because they can be private

    if (viewChannelPermission) {
      // assumes the channel is not visible currently, publish it as CREATE so it's added to the client store
      pubsub.publishFor(userId, ServerEvents.CHANNEL_CREATE, channel);
    } else {
      // assumes the channel is visible currently, publish it as DELETE so it's removed from the client store
      pubsub.publishFor(userId, ServerEvents.CHANNEL_DELETE, channel.id);
    }
  }
};

export {
  publishCategory,
  publishChannel,
  publishChannelPermissions,
  publishEmoji,
  publishMessage,
  publishRole,
  publishSettings,
  publishUser
};
