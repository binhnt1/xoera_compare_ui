export class LinkPermissionDto {
    Name?: string;
    Link?: string;
    Group?: string;
    Order?: number;
    Hover?: boolean;
    Active?: boolean;
    CssIcon?: string;
    ParentId: number;
    GroupOrder?: number;
    Childrens?: LinkPermissionDto[];
}