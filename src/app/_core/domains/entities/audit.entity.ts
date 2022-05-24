import { BaseEntity } from "./base.entity";
import { LookupData } from "../data/lookup.data";
import { NumberType, StringType } from "../enums/data.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { NumberDecorator } from "../../decorators/number.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";

@TableDecorator({ title: 'Audit' })
export class AuditEntity extends BaseEntity {
    
    @DropDownDecorator({ lookup: LookupData.ReferenceStrings(['Agency', 'Address', 'Contact', 'Bank Account', 'Available Suppliers', 'Commissions', 'Permissions']) })
    TableName: string;

    @StringDecorator({ type: StringType.Text, max: 250 })
    Actions: string;

    @StringDecorator({ type: StringType.MultiText, max: 5000 })
    OldData: string;

    @StringDecorator({ type: StringType.MultiText, max: 5000 })
    NewData: string;

    @NumberDecorator({ type: NumberType.Text })
    TableIdValue: number;

    @StringDecorator({ type: StringType.Text, max: 250 })
    CallingMethod: string;

    @StringDecorator({ type: StringType.Text, max: 250 })
    MachineName: string;

    @StringDecorator({ type: StringType.MultiText, max: 5000 })
    Exception: string;

    @StringDecorator({ type: StringType.Text, max: 250 })
    IpAddress: string;

    @StringDecorator({ type: StringType.Text, max: 250 })
    User: string;
}