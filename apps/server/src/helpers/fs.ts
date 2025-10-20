import fs from 'fs/promises';

const ensureDir = async (path: string) => {
  const exists = await fs.exists(path);

  if (!exists) {
    await fs.mkdir(path, { recursive: true });
  }
};

export { ensureDir };
