import { useSelector } from 'react-redux';
import type { enmRole } from '../content/enums';
import { rolePermissions } from '../content/permissions';
import type { RootState } from '../redux/store';

export const useRolePermissions = () => {
    const currentRole = useSelector((state: RootState) => state.auth.user?.role);
    const permissions = rolePermissions[currentRole as enmRole] ?? {};
    return { currentRole, permissions };
};
