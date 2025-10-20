import { useIsAppLoading } from '@/features/app/hooks';
import { useIsConnected } from '@/features/server/hooks';
import { Connect } from '@/screens/connect';
import LoadingApp from '@/screens/loading-app';
import { ServerView } from '@/screens/server-view';
import { memo } from 'react';

const Routing = memo(() => {
  const isConnected = useIsConnected();
  const isAppLoading = useIsAppLoading();

  if (isAppLoading) {
    return <LoadingApp />;
  }

  if (!isConnected) {
    return <Connect />;
  }

  return <ServerView />;
});

export { Routing };
