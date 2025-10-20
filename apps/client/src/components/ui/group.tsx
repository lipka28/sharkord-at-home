import { memo } from 'react';
import { Label } from './label';

type TGroupProps = {
  label: string;
  children: React.ReactNode;
  description?: string;
};

const Group = memo(({ label, children, description }: TGroupProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col">
        <Label>{label}</Label>
        {description && (
          <span className="text-sm text-muted-foreground">{description}</span>
        )}
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
});
Group.displayName = 'Group';

export { Group };
