import { useIsOwnUser } from '@/features/server/users/hooks';
import type { TJoinedMessage } from '@sharkord/shared';
import { memo, useState } from 'react';
import { MessageActions } from './message-actions';
import { MessageEditInline } from './message-edit-inline';
import { MessageRenderer } from './renderer';

type TMessageProps = {
  message: TJoinedMessage;
};

const Message = memo(({ message }: TMessageProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const isFromOwnUser = useIsOwnUser(message.userId);

  return (
    <div className="flex-1 ml-1 relative hover:bg-secondary/50 rounded-md px-1 py-0.5 group">
      {!isEditing ? (
        <>
          <MessageRenderer message={message} />
          <MessageActions
            onEdit={() => setIsEditing(true)}
            disabled={!isFromOwnUser}
            messageId={message.id}
          />
        </>
      ) : (
        <MessageEditInline
          message={message}
          onBlur={() => setIsEditing(false)}
        />
      )}
    </div>
  );
});

export { Message };
