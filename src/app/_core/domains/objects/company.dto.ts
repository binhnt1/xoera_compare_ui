import * as _ from 'lodash';
import { LookupData } from '../data/lookup.data';
import { GenderType } from '../enums/gender.type';
import { LicenceEntity } from '../entities/licence.entity';
import { ImageDecorator } from '../../decorators/image.decorator';
import { TableDecorator } from '../../decorators/table.decorator';
import { StringDecorator } from '../../decorators/string.decorator';
import { NumberDecorator } from '../../decorators/number.decorator';
import { BooleanDecorator } from '../../decorators/boolean.decorator';
import { DateTimeDecorator } from '../../decorators/datetime.decorator';
import { CompanyPartnerEntity } from '../entities/company.partner.entity';
import { BooleanType, DateTimeType, NumberType, StringType } from '../enums/data.type';

@TableDecorator({ name: 'CompanyDto' })
export class CompanyDto {   
    @NumberDecorator()
    Id: number;

    @StringDecorator({ type: StringType.PhoneText, min: 10, max: 15 })
    Phone: string;

    @StringDecorator({ required: true, type: StringType.Email, max: 150 })
    Email: string;

    @BooleanDecorator({ type: BooleanType.RadioButton, lookup: LookupData.ReferenceEnum(GenderType) })
    Gender: GenderType;

    @ImageDecorator({ url: 'upload/uploadavatar' })
    Avatar: string;

    @DateTimeDecorator({ type: DateTimeType.Date, view: 'years' })
    Birthday: Date;

    @StringDecorator({ required: true, type: StringType.Text, max: 150 })
    FirstName: string;

    @StringDecorator({ label: 'Surname', required: true, type: StringType.Text, max: 150 })
    LastName: string;

    @StringDecorator({ type: StringType.Text, max: 250 })
    Address: string;

    @StringDecorator({ type: StringType.Text, min: 6, max: 100 })
    Password?: string;

    @StringDecorator({ type: StringType.Text, min: 6, max: 100 })
    RawPassword?: string;

    @StringDecorator({ label: 'Leader', type: StringType.Text, max: 100 })
    Leader: string;

    @StringDecorator({ label: 'Name', required: true, type: StringType.Text, max: 100 })
    CompanyName: string;

    @StringDecorator({ label: 'Website', type: StringType.Link, max: 250 })
    Website: string;

    @StringDecorator({ label: 'Email', required: true, type: StringType.Email, max: 100 })
    CompanyEmail: string;

    @StringDecorator({ label: 'Phone', required: true, type: StringType.PhoneText, max: 15, min: 10 })
    CompanyPhone: string;

    @StringDecorator({ type: StringType.Text, max: 250 })
    CompanyAddress: string;

    @NumberDecorator({ decimals: 6, type: NumberType.Text })
    Lat: number;

    @NumberDecorator({ decimals: 6, type: NumberType.Text })
    Lng: number;@StringDecorator({ type: StringType.Text, max: 20 })
    PostCode: string;

    @StringDecorator({ required: true, type: StringType.Text, max: 150 })
    PHOName: string;

    @StringDecorator({ label: 'Phone', type: StringType.Text, max: 20 })
    PHOPhone: string;

    @StringDecorator({ label: 'Email', type: StringType.Email, max: 250 })
    PHOEmail: string;

    @StringDecorator({ label: 'Address', required: true, type: StringType.Text, max: 150 })
    PHOAddress: string;

    @NumberDecorator({ type: NumberType.Text, decimals: 8 })
    PHOLat: number;

    @NumberDecorator({ type: NumberType.Text, decimals: 8 })
    PHOLng: number;

    @StringDecorator({ type: StringType.Text, max: 20 })
    PHOPostCode: string;

    @BooleanDecorator()
    IsPublic: boolean;

    @BooleanDecorator()
    Approved: boolean;

    Prices: any[];
    Licences: LicenceEntity[];
    Partners: CompanyPartnerEntity[];
}
