import { RoleDto } from "./role.dto";
import { PermissionDto } from "./permission.dto";

export class OrganizationDto {
    Id: number;
    Name: string;
    Active?: boolean;
    Roles?: RoleDto[];
    AllRoles?: RoleDto[];
    FilterRoles?: RoleDto[];
    PermissionActive?: boolean;
    Permissions?: PermissionDto[];
    AllPermissions?: PermissionDto[];
}