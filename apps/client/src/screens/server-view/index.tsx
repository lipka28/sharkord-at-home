import { LeftSidebar } from '@/components/left-sidebar';
import { RightSidebar } from '@/components/right-sidebar';
import { memo } from 'react';
import { ContentWrapper } from './content-wrapper';

const ServerView = memo(() => {
  return (
    <div className="flex h-screen flex-col bg-background text-foreground dark">
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        <ContentWrapper />
        <RightSidebar />
      </div>
    </div>
  );
});

export { ServerView };
