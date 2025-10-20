import { desc } from 'drizzle-orm';
import { db } from '../..';
import { files } from '../../schema';

let fileIdMutex: Promise<void> = Promise.resolve();

const getUniqueFileId = async (): Promise<number> => {
  return new Promise((resolve) => {
    fileIdMutex = fileIdMutex.then(async () => {
      const maxId = await db
        .select()
        .from(files)
        .orderBy(desc(files.id))
        .limit(1)
        .get();

      const nextId = maxId ? maxId.id + 1 : 1;
      resolve(nextId);
    });
  });
};

export { getUniqueFileId };
