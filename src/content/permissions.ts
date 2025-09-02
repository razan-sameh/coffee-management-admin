import { enmRole } from './enums';

export type typPermission = {
    canAdd: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canViewReports: boolean;
};

export const rolePermissions: Record<enmRole, typPermission> = {
    [enmRole.manager]: {
        canAdd: true,
        canEdit: true,
        canDelete: true,
        canViewReports: true,
    },
    [enmRole.admin]: {
        canAdd: true,
        canEdit: true,
        canDelete: true,
        canViewReports: false,
    },
    [enmRole.user]: {
        canAdd: false,
        canEdit: false,
        canDelete: false,
        canViewReports: false,
    },
    [enmRole.customer]: {
        canAdd: false,
        canEdit: false,
        canDelete: false,
        canViewReports: false,
    },
    [enmRole.driver]: {
        canAdd: false,
        canEdit: false,
        canDelete: false,
        canViewReports: false
    }
};
