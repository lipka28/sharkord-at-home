import { t } from '../../utils/trpc';
import { addChannelRoute } from './add-channel';
import { deleteChannelRoute } from './delete-channel';
import { deletePermissionsRoute } from './delete-permissions';
import {
  onChannelCreateRoute,
  onChannelDeleteRoute,
  onChannelPermissionsUpdateRoute,
  onChannelUpdateRoute
} from './events';
import { getChannelRoute } from './get-channel';
import { getPermissionsRoute } from './get-permissions';
import { reorderChannelsRoute } from './reorder-channels';
import { updateChannelRoute } from './update-channel';
import { updatePermissionsRoute } from './update-permission';

export const channelsRouter = t.router({
  add: addChannelRoute,
  update: updateChannelRoute,
  delete: deleteChannelRoute,
  get: getChannelRoute,
  updatePermissions: updatePermissionsRoute,
  getPermissions: getPermissionsRoute,
  deletePermissions: deletePermissionsRoute,
  reorder: reorderChannelsRoute,
  onCreate: onChannelCreateRoute,
  onDelete: onChannelDeleteRoute,
  onUpdate: onChannelUpdateRoute,
  onPermissionsUpdate: onChannelPermissionsUpdateRoute
});
