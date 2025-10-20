import { getTRPCClient } from '@/lib/trpc';
import { UserStatus, type TJoinedPublicUser } from '@sharkord/shared';
import { addUser, handleUserJoin, updateUser } from './actions';

const subscribeToUsers = () => {
  const trpc = getTRPCClient();

  const onUserJoinSub = trpc.users.onJoin.subscribe(undefined, {
    onData: (user: TJoinedPublicUser) => {
      console.log('Received user join via subscription:', user);

      handleUserJoin(user);
    },
    onError: (err) => console.error('onUserJoin subscription error:', err)
  });

  const onUserCreateSub = trpc.users.onCreate.subscribe(undefined, {
    onData: (user: TJoinedPublicUser) => {
      console.log('Received user create via subscription:', user);

      addUser(user);
    },
    onError: (err) => console.error('onUserCreate subscription error:', err)
  });

  const onUserLeaveSub = trpc.users.onLeave.subscribe(undefined, {
    onData: (userId: number) => {
      console.log('Received user leave via subscription:', userId);

      updateUser(userId, { status: UserStatus.OFFLINE });
    },
    onError: (err) => console.error('onUserLeave subscription error:', err)
  });

  const onUserUpdateSub = trpc.users.onUpdate.subscribe(undefined, {
    onData: (user: TJoinedPublicUser) => {
      console.log('Received user update via subscription:', user);

      updateUser(user.id, user);
    },
    onError: (err) => console.error('onUserUpdate subscription error:', err)
  });

  return () => {
    onUserJoinSub.unsubscribe();
    onUserLeaveSub.unsubscribe();
    onUserUpdateSub.unsubscribe();
    onUserCreateSub.unsubscribe();
  };
};

export { subscribeToUsers };
