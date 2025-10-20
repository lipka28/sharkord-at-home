import type { TFile } from '@sharkord/shared';
import { eq } from 'drizzle-orm';
import { db } from '../..';
import { files } from '../../schema';

const getFile = async (fileId: number): Promise<TFile | undefined> =>
  db.select().from(files).where(eq(files.id, fileId)).get();

export { getFile };
