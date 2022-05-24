import { StringType } from "../enums/data.type";
import { PermissionDto } from "./permission.dto";
import { RoleEntity } from "../entities/role.entity";
import { LookupUniqueData } from "../data/lookup.data";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { NumberDecorator } from "../../decorators/number.decorator";
import { BooleanDecorator } from "../../decorators/boolean.decorator";

TableDecorator()
export class RoleDto {
    @NumberDecorator()
    Id: number;

    @NumberDecorator()
    Amount?: number;

    @BooleanDecorator()
    Allow?: boolean;

    @StringDecorator({ required: true, allowSearch: true, type: StringType.Text, max: 10, unique: LookupUniqueData.Reference(RoleEntity, 'Code') })
    Code: string;

    @StringDecorator({ required: true, allowSearch: true, type: StringType.Text, max: 200, unique: LookupUniqueData.Reference(RoleEntity, 'Name') })
    Name: string;

    @StringDecorator({ type: StringType.MultiText, max: 1000 })
    Description: string;

    UserIds: number[];
    Permissions: PermissionDto[];
}