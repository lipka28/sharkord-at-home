import { t } from '../../utils/trpc';
import { addCategoryRoute } from './add-category';
import { deleteCategoryRoute } from './delete-category';
import {
  onCategoryCreateRoute,
  onCategoryDeleteRoute,
  onCategoryUpdateRoute
} from './events';
import { getCategoryRoute } from './get-category';
import { updateCategoryRoute } from './update-emoji';

export const categoriesRouter = t.router({
  add: addCategoryRoute,
  update: updateCategoryRoute,
  delete: deleteCategoryRoute,
  get: getCategoryRoute,
  onCreate: onCategoryCreateRoute,
  onDelete: onCategoryDeleteRoute,
  onUpdate: onCategoryUpdateRoute
});
