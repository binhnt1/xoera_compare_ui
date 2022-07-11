import { BaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
import { LookupData } from "../data/lookup.data";
import { NumberType, StringType } from "../enums/data.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { NumberDecorator } from "../../decorators/number.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";
import { BooleanDecorator } from "../../decorators/boolean.decorator";

@TableDecorator({ title: 'Company' })
export class CompanyEntity extends BaseEntity {

    @StringDecorator({ required: true, type: StringType.Text, max: 150 })
    FirstName: string;

    @StringDecorator({ label: 'Surname', required: true, type: StringType.Text, max: 150 })
    LastName: string;

    @StringDecorator({ type: StringType.Text, max: 20 })
    Phone: string;

    @StringDecorator({ type: StringType.Email, max: 150 })
    Email: string;

    @StringDecorator({ type: StringType.Text, max: 150 })
    RegisterNumber: string;

    @StringDecorator({ type: StringType.MultiText, max: 500 })
    Address: string;

    @DropDownDecorator({ lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    AccountId: number;

    @NumberDecorator({ type: NumberType.Text, decimals: 8 })
    Lat: number;

    @NumberDecorator({ type: NumberType.Text, decimals: 8 })
    Lng: number;

    @StringDecorator({ type: StringType.Text, max: 20 })
    PostCode: string;

    @StringDecorator({ required: true, type: StringType.Text, max: 150 })
    PHOName: string;

    @StringDecorator({ label: 'Booking Office Number', type: StringType.Text, max: 20 })
    PHOPHone: string;

    @StringDecorator({ label: 'Address', required: true, type: StringType.Text, max: 150 })
    PHOAddress: string;

    @NumberDecorator({ type: NumberType.Text, decimals: 8 })
    PHOLat: number;

    @NumberDecorator({ type: NumberType.Text, decimals: 8 })
    PHOLng: number;

    @StringDecorator({ type: StringType.Text, max: 20 })
    PHOPostCode: string;

    @StringDecorator({ type: StringType.Text, max: 200 })
    PHOLicence: string;

    @BooleanDecorator()
    IsPublic: boolean;
}