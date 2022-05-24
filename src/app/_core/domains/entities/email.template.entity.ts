import { BaseEntity } from "./base.entity";
import { StringType } from "../enums/data.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { BooleanDecorator } from "../../decorators/boolean.decorator";

@TableDecorator()
export class EmailTemplateEntity extends BaseEntity {
    @StringDecorator({ type: StringType.Text, max: 50 })
    Type: string;

    @StringDecorator({ type: StringType.Text, max: 60 })
    Name: string;

    @BooleanDecorator()
    IsLetter: boolean;

    @BooleanDecorator()
    IsDefault: boolean;

    @StringDecorator({ required: true, type: StringType.Text, max: 250 })
    EmailSubject: string;

    @StringDecorator({ type: StringType.MultiText, rows: 28, max: 2000000 })
    Template: string;

    @StringDecorator({
        required: true, type: StringType.Html, max: 2000000,
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
            { name: 'Trade Contact' },
            { name: 'Deemed Unit Rate' },
            { name: 'Deemed Standing Charge' },
            { name: 'OurFindings' },
            { name: 'OurEvidence' }
        ]
    })
    TemplateHtml: string;
}