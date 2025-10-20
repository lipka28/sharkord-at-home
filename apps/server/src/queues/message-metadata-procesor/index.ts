import Queue from 'queue';
import { publishMessageUpdate } from '../../db/publishers';
import { processMessageMetadata } from './get-message-metadata';

const messagesMetadataProcessor = new Queue({
  concurrency: 1,
  autostart: true,
  timeout: 3000
});

messagesMetadataProcessor.autostart = true;
messagesMetadataProcessor.start();

export const enqueueProcessMetadata = (content: string, messageId: number) => {
  messagesMetadataProcessor.push(async (callback) => {
    const updatedMessage = await processMessageMetadata(content, messageId);

    if (updatedMessage) {
      await publishMessageUpdate(messageId);
    }

    callback?.();
  });
};
