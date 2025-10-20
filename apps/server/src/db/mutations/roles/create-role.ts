import type { TIRole, TRole } from '@sharkord/shared';
import { db } from '../..';
import { roles } from '../../schema';

const createRole = async (
  role: Omit<TIRole, 'createdAt'>
): Promise<TRole | undefined> =>
  db
    .insert(roles)
    .values({
      name: role.name,
      isPersistent: false,
      color: role.color,
      isDefault: false,
      createdAt: Date.now()
    })
    .returning()
    .get();

export { createRole };
