import { BaseEntity } from "./base.entity";
import { StringType } from "../enums/data.type";
import { FileDecorator } from "../../decorators/file.decorator";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";

@TableDecorator({ title: 'Supplier' })
export class SupplierEntity extends BaseEntity {

    @StringDecorator({ required: true, type: StringType.Text, max: 250 })
    Name: string;

    @StringDecorator({ type: StringType.Text, max: 250 })
    Abbreviation: string;

    @StringDecorator({ type: StringType.Text, max: 250 })
    ContactName: string;

    @StringDecorator({ type: StringType.PhoneText, max: 50 })
    ContactPhone: string;

    @StringDecorator({ type: StringType.Text, max: 250 })
    AddressLine: string;

    @StringDecorator({ type: StringType.Text, max: 250 })
    City: string;

    @StringDecorator({ type: StringType.Text, max: 250 })
    PostCode: string;

    @FileDecorator({ label: 'Logo' })
    Logo: any;

    @StringDecorator({ type: StringType.Text, max: 5000 })
    LogoBase64: string;
}