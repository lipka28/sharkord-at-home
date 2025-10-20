import { t } from '../../utils/trpc';
import { changeAvatarRoute } from './change-avatar';
import { changeBannerRoute } from './change-banner';
import {
  onUserCreateRoute,
  onUserJoinRoute,
  onUserLeaveRoute,
  onUserUpdateRoute
} from './events';
import { updateUserRoute } from './update-user';

export const usersRouter = t.router({
  changeAvatar: changeAvatarRoute,
  changeBanner: changeBannerRoute,
  update: updateUserRoute,
  onJoin: onUserJoinRoute,
  onLeave: onUserLeaveRoute,
  onUpdate: onUserUpdateRoute,
  onCreate: onUserCreateRoute
});
