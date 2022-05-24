import { BaseEntity } from "./base.entity";
import { StringType } from "../enums/data.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";

@TableDecorator({ title: 'Email Log' })
export class EmailLogEntity extends BaseEntity {

    @StringDecorator({ type: StringType.Text })
    Smtpuser: string;

    @StringDecorator({ type: StringType.Email })
    EmailTo: string;

    @StringDecorator({ type: StringType.Email })
    EmailFrom: string;

    @StringDecorator({ type: StringType.Text, max: 2000 })
    ErrorMessage: string;
}