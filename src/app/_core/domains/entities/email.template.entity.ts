import { BaseEntity } from "./base.entity";
import { StringType } from "../enums/data.type";
import { LookupData } from "../data/lookup.data";
import { SmtpAccountEntity } from "./smtp.account.entity";
import { ConstantHelper } from "../../helpers/constant.helper";
import { EmailTemplateType } from "../enums/email.template.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";

@TableDecorator({ title: 'Email Template' })
export class EmailTemplateEntity extends BaseEntity {

    @DropDownDecorator({ required: true, allowSearch: true, lookup: { items: ConstantHelper.EMAILTEMPLATE_TYPES } })
    Type: EmailTemplateType;

    @StringDecorator({ required: true, allowSearch: true, type: StringType.Text, max: 550 })
    Title: string;

    @DropDownDecorator({ label: 'Tài khoản gửi mail', required: true, allowSearch: true, lookup: LookupData.Reference(SmtpAccountEntity, ['UserName', 'Host']) })
    SmtpAccountId: number;

    @StringDecorator({
        required: true, type: StringType.Html, max: 2000000,
        variables: [
            { name: 'Link' },
            { name: 'Email' },
            { name: 'FullName' },
        ]
    })
    Content: string;
}