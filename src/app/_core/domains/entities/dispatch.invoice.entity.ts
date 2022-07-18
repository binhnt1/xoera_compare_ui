import { BaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
import { LookupData, LookupUniqueData } from "../data/lookup.data";
import { DateTimeType, StringType } from "../enums/data.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { InvoicePaymentType } from "../enums/invoice.payment.type";
import { NumberDecorator } from "../../decorators/number.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";
import { DateTimeDecorator, DateTimeFormat } from "../../decorators/datetime.decorator";

@TableDecorator({ title: 'DispatchInvoice' })
export class DispatchInvoiceEntity extends BaseEntity {

    @StringDecorator({ label: 'Invoice Number', required: true, max: 20, unique: LookupUniqueData.Reference(DispatchInvoiceEntity, 'Code') })
    Code: string;

    @StringDecorator({ label: 'Delivery Address', required: true, max: 250 })
    Address: string;

    @StringDecorator({ label: 'Name', required: true, max: 250 })
    CompanyName: string;

    @StringDecorator({ type: StringType.Text, max: 200 })
    BuildingNumber: string;

    @StringDecorator({ type: StringType.Text, max: 200 })
    Street: string;

    @StringDecorator({ max: 20 })
    PostCode: string;

    @StringDecorator({ type: StringType.Text, max: 20 })
    Phone: string;

    @StringDecorator({ type: StringType.Text, max: 20 })
    DeliveryMethod: string;

    @DateTimeDecorator({ required: true, type: DateTimeType.Date, format: DateTimeFormat.DMY })
    DueDate: Date;

    @DateTimeDecorator({ required: true, type: DateTimeType.Date, format: DateTimeFormat.DMY })
    IssueDate: Date;

    @DropDownDecorator({ lookup: LookupData.ReferenceEnum(InvoicePaymentType) })
    PaymentType: InvoicePaymentType;

    @DropDownDecorator({ required: true, label: 'Company', lookup: LookupData.ReferenceUrl('/user/LookupCompany', ['Company']) })
    AccountId: number;

    InvoiceDetails: DispatchInvoiceDetailEntity[];
}

@TableDecorator({ title: 'DispatchInvoiceDetail' })
export class DispatchInvoiceDetailEntity extends BaseEntity {

    @DropDownDecorator({ required: true, lookup: LookupData.Reference(DispatchInvoiceEntity, ['Code']) })
    DispatchInvoiceId?: number;

    @StringDecorator({ required: true, label: 'Description', max: 250 })
    Period: string;

    @NumberDecorator({ required: true, step: 0.02, decimals: 2 })
    Amount: number;

    @NumberDecorator({ required: true, step: 0.02, decimals: 2 })
    Discount: number;

    @NumberDecorator({ required: true, step: 0.02, decimals: 2 })
    PaidUnpaid: number;

    @NumberDecorator({ step: 0.02, decimals: 2 })
    SubTotal?: number;
}