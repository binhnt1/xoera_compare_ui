import { OptionItem } from "../data/option.item";

export class PermissionDto {
    Id?: number;
    Name?: string;
    Group?: string;
    Title?: string;
    Action?: string;
    Allow?: boolean;
    Active?: boolean;
    ReadOnly?: boolean;
    Controller?: string;
    Organization?: string;
}