import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FileCategory, getFileCategory } from '@sharkord/shared';
import { filesize } from 'filesize';
import {
  File,
  FileImage,
  FileMusic,
  FileText,
  FileVideo,
  Trash
} from 'lucide-react';
import { memo, useCallback, useMemo } from 'react';

type TFileIconProps = {
  extension: string;
};

const categoryMap: Record<FileCategory, React.ElementType> = {
  [FileCategory.AUDIO]: FileMusic,
  [FileCategory.IMAGE]: FileImage,
  [FileCategory.VIDEO]: FileVideo,
  [FileCategory.DOCUMENT]: FileText,
  [FileCategory.OTHER]: File
};

const FileIcon = memo(({ extension }: TFileIconProps) => {
  const category = useMemo(() => getFileCategory(extension), [extension]);
  const className = 'h-5 w-5 text-muted-foreground';

  const Icon = categoryMap[category] || File;

  return <Icon className={className} />;
});

type TFileCardProps = {
  name: string;
  size: number;
  extension: string;
  onRemove?: () => void;
  onDownload?: () => void;
};

const FileCard = ({
  onDownload,
  name,
  size,
  extension,
  onRemove
}: TFileCardProps) => {
  const onDownloadClick = useCallback(() => {
    onDownload?.();
  }, [onDownload]);

  return (
    <div className="flex max-w-sm items-center gap-3 rounded-lg border border-border p-2 select-none">
      <div className="flex shrink-0 items-center justify-center rounded">
        <FileIcon extension={extension} />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <span
          className={cn(
            'truncate text-sm font-medium text-foregroun',
            onDownload && 'hover:underline cursor-pointer'
          )}
          onClick={onDownloadClick}
        >
          {name}
        </span>
        <span className="text-xs text-muted-foreground">{filesize(size)}</span>
      </div>
      {onRemove && (
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 shrink-0"
          onClick={onRemove}
        >
          <Trash className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export { FileCard };
