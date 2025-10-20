import { store } from '@/features/store';
import type { TCategory } from '@sharkord/shared';
import { serverSliceActions } from '../slice';

export const setCategories = (categories: TCategory[]) => {
  store.dispatch(serverSliceActions.setCategories(categories));
};
