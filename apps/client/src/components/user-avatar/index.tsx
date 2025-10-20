import { useUserById } from '@/features/server/users/hooks';
import { getFileUrl } from '@/helpers/get-file-url';
import { getInitialsFromName } from '@/helpers/get-initials-from-name';
import { cn } from '@/lib/utils';
import { AvatarImage } from '@radix-ui/react-avatar';
import { UserStatus } from '@sharkord/shared';
import { memo } from 'react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { UserPopover } from '../user-popover';

type TUserAvatarProps = {
  userId: number;
  className?: string;
  showUserPopover?: boolean;
  showStatusBadge?: boolean;
  onClick?: () => void;
};

const UserAvatar = memo(
  ({
    userId,
    className,
    showUserPopover = false,
    showStatusBadge = true,
    onClick
  }: TUserAvatarProps) => {
    const user = useUserById(userId);

    if (!user) return null;

    const content = (
      <div className="relative w-fit h-fit" onClick={onClick}>
        <Avatar className={cn('h-8 w-8', className)}>
          <AvatarImage src={getFileUrl(user.avatar)} key={user.avatarId} />
          <AvatarFallback className="bg-muted text-xs">
            {getInitialsFromName(user.name)}
          </AvatarFallback>
        </Avatar>
        {showStatusBadge && (
          <div
            className={cn(
              'absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card',
              user.status === UserStatus.ONLINE && 'bg-green-500',
              user.status === UserStatus.IDLE && 'bg-yellow-500',
              user.status === UserStatus.OFFLINE && 'bg-gray-500'
            )}
          />
        )}
      </div>
    );

    if (!showUserPopover) return content;

    return <UserPopover userId={userId}>{content}</UserPopover>;
  }
);

export { UserAvatar };
