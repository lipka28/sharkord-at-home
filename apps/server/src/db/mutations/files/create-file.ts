import type { TFile, TIFile } from '@sharkord/shared';
import { db } from '../..';
import { files } from '../../schema';

const createFile = async (file: TIFile): Promise<TFile> =>
  db.insert(files).values(file).returning().get();

export { createFile };
