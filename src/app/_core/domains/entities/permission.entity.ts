import { BaseEntity } from "./base.entity";
import { StringType } from "../enums/data.type";
import { LookupData } from "../data/lookup.data";
import { ConstantHelper } from "../../helpers/constant.helper";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { BooleanDecorator } from "../../decorators/boolean.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";

@TableDecorator()
export class PermissionEntity extends BaseEntity {
    @StringDecorator({ type: StringType.Text, max: 150 })
    Group: string;

    @StringDecorator({ type: StringType.Text, max: 150 })
    Title: string;

    @StringDecorator({ allowSearch: true, required: true, type: StringType.Text, max: 150 })
    Name: string;

    @DropDownDecorator({ allowSearch: true, required: true, lookup: { url: '/utility/controllers' } })
    Controller: string;

    @DropDownDecorator({ allowSearch: true, required: true, lookup: { url: '/utility/actions', dependId: 'Controller' } })
    Action: string;
}