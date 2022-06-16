import { BaseEntity } from "./base.entity";
import { DateTimeType, StringType } from "../enums/data.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { BooleanDecorator } from "../../decorators/boolean.decorator";
import { DateTimeDecorator } from "../../decorators/datetime.decorator";

@TableDecorator({ title: 'Agreement' })
export class AgreementEntity extends BaseEntity {

    @StringDecorator({ required: true, type: StringType.Text, max: 150 })
    Name: string;

    @BooleanDecorator()
    Binding: boolean;

    @StringDecorator({ required: true, type: StringType.Html, max: 10000 })
    Content: string;

    @DateTimeDecorator({ type: DateTimeType.Date })
    IssueDate: string;

    @DateTimeDecorator({ type: DateTimeType.Date })
    ExpiryDate: string;

    @DateTimeDecorator({ type: DateTimeType.Date })
    EffectiveFrom: string;
}