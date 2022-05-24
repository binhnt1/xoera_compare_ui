import { StringType } from "../enums/data.type";
import { LookupData } from "../data/lookup.data";
import { BaseEntity } from "../entities/base.entity";
import { FileDecorator } from "../../decorators/file.decorator";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { SmtpAccountEntity } from "../entities/smtp.account.entity";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";
import { EmailTemplateEntity } from "../entities/email.template.entity";

@TableDecorator({ name: 'BulkMailDto' })
export class BulkMailDto extends BaseEntity {
    @StringDecorator({ required: true, type: StringType.Text, max: 250 })
    public Subject: string;

    @StringDecorator({
        required: true, type: StringType.Html,
        variables: [
            { name: 'Account Balance' },
            { name: 'Account Number' },
            { name: 'Action Taken If Apology' },
            { name: 'Aq' },
            { name: 'Billing Address' },
            { name: 'Billing Contact' },
            { name: 'Broker Name' },
            { name: 'Business Address' },
            { name: 'Business Name' },
            { name: 'Client Name' },
            { name: 'Complaint Ref Number' },
            { name: 'Contract Start Date' },
            { name: 'Contract End Date' },
            { name: 'Contract Length' },
            { name: 'Customer Contact' },
            { name: 'Finding If Deadlock' },
            { name: 'Forwarding Address' },
            { name: 'Issue Date' },
            { name: 'Issue Date Time' },
            { name: 'Landlord Address' },
            { name: 'Landlord Name1' },
            { name: 'Landlord Name2' },
            { name: 'Meter Serial Number' },
            { name: 'MPRN Number' },
            { name: 'Our Decision If Deadlock' },
            { name: 'Payment Method' },
            { name: 'Reason For Apology' },
            { name: 'Receiver Address' },
            { name: 'Receiver Name' },
            { name: 'Selling Rate' },
            { name: 'Site Address' },
            { name: 'Site Contact' },
            { name: 'Site Reference Number' },
            { name: 'Standing Charge' },
            { name: 'Trade Contact' },
            { name: 'Deemed Unit Rate' },
            { name: 'Deemed Standing Charge' },
            { name: 'OurFindings' },
            { name: 'OurEvidence' }
        ]
    })
    public Content: string;

    public Contacts: any[];

    @StringDecorator({ required: true, type: StringType.Tag, max: 250 })
    public Emails?: string[];

    @DropDownDecorator({ required: true, lookup: LookupData.Reference(SmtpAccountEntity, ['User']) })
    public SmtpAccountId: number;

    @DropDownDecorator({ lookup: LookupData.Reference(EmailTemplateEntity, ['Name']) })
    public EmailTemplateId: number;

    @FileDecorator({ multiple: true })
    public Attachments: string[];
    public FileAttachments: Attachment[];
}

export class Attachment {
    public AttachmentName: string;
    public AttachmentFile: string;
    public AttachmentSize?: string;
}