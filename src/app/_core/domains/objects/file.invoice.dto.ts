import { DispatchInvoiceDetailEntity } from "../entities/dispatch.invoice.entity";

export class FileInvoiceDto {
    Code: string;
    Phone: string;
    Email: string;
    Address: string;
    IssueDate: Date;
    PaymentType: string;
    BillingPhone: string;
    BillingAddress: string;
    BillingPostcode: string;
    DeliveryPhone: string;
    DeliveryAddress: string;
    DeliveryPostcode: string;
    Details: DispatchInvoiceDetailEntity[];
}