import type { IRootState } from '@/features/store';
import { createSelector } from '@reduxjs/toolkit';

export const categoriesSelector = (state: IRootState) =>
  state.server.categories;

export const categoryByIdSelector = createSelector(
  [categoriesSelector, (_, categoryId: number) => categoryId],
  (categories, categoryId) =>
    categories.find((category) => category.id === categoryId)
);
