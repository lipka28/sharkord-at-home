import { Card, CardContent } from '@/components/ui/card';
import { useAdminRoles } from '@/features/server/admin/hooks';
import { memo, useMemo, useState } from 'react';
import { RolesList } from './roles-list';
import { UpdateRole } from './update-role';

const Roles = memo(() => {
  const { roles, refetch } = useAdminRoles();

  const [selectedRoleId, setSelectedRoleId] = useState<number | undefined>();

  const selectedRole = useMemo(() => {
    return roles.find((r) => r.id === selectedRoleId) || null;
  }, [roles, selectedRoleId]);

  return (
    <div className="flex gap-6">
      <RolesList
        roles={roles}
        selectedRoleId={selectedRoleId}
        setSelectedRoleId={setSelectedRoleId}
        refetch={refetch}
      />

      {selectedRole ? (
        <UpdateRole
          key={selectedRole.id}
          selectedRole={selectedRole}
          setSelectedRoleId={setSelectedRoleId}
          refetch={refetch}
        />
      ) : (
        <Card className="flex flex-1 items-center justify-center">
          <CardContent className="py-12 text-center text-muted-foreground">
            Select a role to edit or create a new one
          </CardContent>
        </Card>
      )}
    </div>
  );
});

export { Roles };
