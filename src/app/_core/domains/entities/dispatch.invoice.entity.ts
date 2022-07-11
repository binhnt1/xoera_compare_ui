import { BaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
import { LookupData } from "../data/lookup.data";
import { DateTimeType } from "../enums/data.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { NumberDecorator } from "../../decorators/number.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";
import { DateTimeDecorator, DateTimeFormat } from "../../decorators/datetime.decorator";

@TableDecorator({ title: 'DispatchInvoice' })
export class DispatchInvoiceEntity extends BaseEntity {

    @DropDownDecorator({ required: true, lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    AccountId: number;

    @StringDecorator({ required: true, max: 250 })
    Period: string;

    @DateTimeDecorator({ required: true, type: DateTimeType.Date, format: DateTimeFormat.DMY })
    IssueDate: Date;

    @NumberDecorator({ required: true, step: 0.02, decimals: 2 })
    Amount: number;

    @NumberDecorator({ required: true, step: 0.02, decimals: 2 })
    PaidUnpaid: number;
}