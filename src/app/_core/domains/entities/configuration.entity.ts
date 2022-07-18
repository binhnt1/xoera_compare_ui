import { BaseEntity } from "./base.entity";
import { StringType } from "../enums/data.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";

@TableDecorator({ title: 'Configuration' })
export class ConfigurationEntity extends BaseEntity {

    @StringDecorator({ required: true, type: StringType.Text, max: 200 })
    OurCompanyName: string;

    @StringDecorator({ required: true, type: StringType.Email, max: 200 })
    OurCompanyEmail: string;

    @StringDecorator({ required: true, type: StringType.Text, max: 20 })
    OurCompanyPhone: string;

    @StringDecorator({ required: true, type: StringType.Text, max: 200 })
    OurCompanyBankName: string;

    @StringDecorator({ required: true, type: StringType.Text, max: 200 })
    OurCompanyAddress: string;

    @StringDecorator({ required: true, type: StringType.Text, max: 20 })
    OurCompanyBankSortCode: string;

    @StringDecorator({ required: true, type: StringType.Text, max: 200 })
    OurCompanyBankAccountName: string;

    @StringDecorator({ required: true, type: StringType.Text, max: 20 })
    OurCompanyBankAccountNumber: string;
}