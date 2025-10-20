import { t } from '../../utils/trpc';
import { addChannelRoute } from './add-channel';
import { deleteChannelRoute } from './delete-channel';
import {
  onChannelCreateRoute,
  onChannelDeleteRoute,
  onChannelUpdateRoute
} from './events';
import { getChannelRoute } from './get-channel';
import { updateChannelRoute } from './update-channel';

export const channelsRouter = t.router({
  add: addChannelRoute,
  update: updateChannelRoute,
  delete: deleteChannelRoute,
  get: getChannelRoute,
  onCreate: onChannelCreateRoute,
  onDelete: onChannelDeleteRoute,
  onUpdate: onChannelUpdateRoute
});
