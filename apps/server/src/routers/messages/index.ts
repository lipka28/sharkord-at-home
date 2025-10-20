import { t } from '../../utils/trpc';
import { deleteMessageRoute } from './delete-message';
import { editMessageRoute } from './edit-message';
import {
  onMessageDeleteRoute,
  onMessageRoute,
  onMessageUpdateRoute
} from './events';
import { getMessagesRoute } from './get-messages';
import { sendMessageRoute } from './send-message';
import { toggleMessageReactionRoute } from './toggle-message-reaction';

export const messagesRouter = t.router({
  send: sendMessageRoute,
  edit: editMessageRoute,
  delete: deleteMessageRoute,
  get: getMessagesRoute,
  toggleReaction: toggleMessageReactionRoute,
  onNew: onMessageRoute,
  onUpdate: onMessageUpdateRoute,
  onDelete: onMessageDeleteRoute
});
