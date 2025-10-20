import { useUserRole } from '@/features/server/hooks';
import { useUserById } from '@/features/server/users/hooks';
import { getFileUrl } from '@/helpers/get-file-url';
import { cn } from '@/lib/utils';
import { UserStatus } from '@sharkord/shared';
import { format } from 'date-fns';
import { memo } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { UserAvatar } from '../user-avatar';

type TUserPopoverProps = {
  userId: number;
  children: React.ReactNode;
};

const UserPopover = memo(({ userId, children }: TUserPopoverProps) => {
  const user = useUserById(userId);
  const role = useUserRole(userId)!;

  if (!user) return <>{children}</>;

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start" side="right">
        <div className="relative">
          {user.banner ? (
            <div
              className="h-24 w-full rounded-t-md bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${getFileUrl(user.banner)})`
              }}
            />
          ) : (
            <div
              className="h-24 w-full rounded-t-md"
              style={{
                background: user.bannerColor || '#5865f2'
              }}
            />
          )}
          <div className="absolute left-4 top-16">
            <UserAvatar
              userId={user.id}
              className="h-16 w-16 border-4 border-card"
              showStatusBadge={false}
            />
          </div>
        </div>

        <div className="px-4 pt-12 pb-4">
          <div className="mb-3">
            <span className="text-lg font-semibold text-foreground truncate mb-1">
              {user.name}
            </span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'h-2 w-2 rounded-full',
                    user.status === UserStatus.ONLINE && 'bg-green-500',
                    user.status === UserStatus.IDLE && 'bg-yellow-500',
                    user.status === UserStatus.OFFLINE && 'bg-gray-500'
                  )}
                />
                <span className="text-xs text-muted-foreground capitalize">
                  {user.status || UserStatus.OFFLINE}
                </span>
              </div>
              <div className="w-1 h-1 rounded-full bg-white" />
              <span
                className="text-xs font-medium"
                style={{
                  color: role.color
                }}
              >
                {role.name}
              </span>
            </div>
          </div>
          {user.bio && (
            <div className="mt-3">
              <p className="text-sm text-foreground leading-relaxed">
                {user.bio}
              </p>
            </div>
          )}
          <div className="mt-4 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Member since {format(new Date(user.createdAt), 'PP')}
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
});

UserPopover.displayName = 'UserPopover';

export { UserPopover };
