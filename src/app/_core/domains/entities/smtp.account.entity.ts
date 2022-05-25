import { BaseEntity } from "./base.entity";
import { StringType } from "../enums/data.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { NumberDecorator } from "../../decorators/number.decorator";
import { BooleanDecorator } from "../../decorators/boolean.decorator";

@TableDecorator({ title: 'Smtp Account' })
export class SmtpAccountEntity extends BaseEntity {

    @StringDecorator({ required: true, type: StringType.Text })
    Host: string;

    @NumberDecorator()
    Port: number;

    @StringDecorator({ required: true, type: StringType.Account })
    UserName: string;

    @StringDecorator({ required: true, type: StringType.Password, label: 'Password' })
    Password: string;

    @StringDecorator({ type: StringType.Email })
    EmailFrom: string;

    @BooleanDecorator()
    EnableSsl: string;
}