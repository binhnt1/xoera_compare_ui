import { BaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
import { StringType } from "../enums/data.type";
import { LookupData } from "../data/lookup.data";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";

@TableDecorator({ title: 'Company' })
export class CompanyEntity extends BaseEntity {

    @StringDecorator({ required: true, type: StringType.Text, max: 150 })
    Name: string;

    @StringDecorator({ type: StringType.Text, max: 20 })
    Phone: string;

    @StringDecorator({ type: StringType.Email, max: 150 })
    Email: string;

    @StringDecorator({ type: StringType.Text, max: 150 })
    Leader: string;

    @StringDecorator({ type: StringType.MultiText, max: 500 })
    Address: string;

    @DropDownDecorator({ lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    AccountId: number;
}