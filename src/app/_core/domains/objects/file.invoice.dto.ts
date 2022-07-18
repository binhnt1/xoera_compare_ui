import { DispatchInvoiceDetailEntity } from "../entities/dispatch.invoice.entity";

export class FileInvoiceDto {
    Code: string;
    Total: number;
    IssueDate: Date;
    PaymentType: string;

    BillingPhone: string;
    BillingAddress: string;
    BillingPostcode: string;

    DeliveryPhone: string;
    DeliveryAddress: string;
    DeliveryPostcode: string;

    OurCompanyName: string;
    OurCompanyPhone: string;
    OurCompanyEmail: string;
    OurCompanyAddress: string;
    OurCompanyBankName: string;
    OurCompanyBankSortCode: string;
    OurCompanyBankAccountName: string;
    OurCompanyBankAccountNumber: string;

    Details: DispatchInvoiceDetailEntity[];
}