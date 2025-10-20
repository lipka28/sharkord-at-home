import { openDialog } from '@/features/dialogs/actions';
import {
  useCategories,
  useCategoryById
} from '@/features/server/categories/hooks';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { memo, useCallback, useState } from 'react';
import { Dialog } from '../dialogs/dialogs';
import { Button } from '../ui/button';
import { Tooltip } from '../ui/tooltip';
import { Channels } from './channels';

type TCategoryProps = {
  categoryId: number;
};

const Category = memo(({ categoryId }: TCategoryProps) => {
  const [expanded, setExpanded] = useState(true);
  const category = useCategoryById(categoryId);

  const onCreateChannelClick = useCallback(() => {
    openDialog(Dialog.CREATE_CHANNEL, { categoryId });
  }, [categoryId]);

  if (!category) {
    return null;
  }

  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  return (
    <div key={category.id} className="mb-4">
      <div className="mb-1 flex w-full items-center px-2 py-1 text-xs font-semibold text-muted-foreground">
        <div className="flex w-full items-center gap-1">
          <Button
            variant="ghost"
            size="iconXs"
            onClick={() => setExpanded((v) => !v)}
          >
            <ChevronIcon className="h-3 w-3" />
          </Button>
          <span>{category.name}</span>
        </div>

        <Tooltip content="Create channel">
          <Button variant="ghost" size="iconXs" onClick={onCreateChannelClick}>
            <Plus className="h-2 w-2" />
          </Button>
        </Tooltip>
      </div>

      {expanded && <Channels categoryId={category.id} />}
    </div>
  );
});

const Categories = memo(() => {
  const categories = useCategories();

  return (
    <div className="flex-1 overflow-y-auto p-2">
      {categories.map((category) => (
        <Category key={category.id} categoryId={category.id} />
      ))}
    </div>
  );
});

export { Categories };
