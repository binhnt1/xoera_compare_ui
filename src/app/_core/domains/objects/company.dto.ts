import * as _ from 'lodash';
import { LookupData } from '../data/lookup.data';
import { GenderType } from '../enums/gender.type';
import { ImageDecorator } from '../../decorators/image.decorator';
import { TableDecorator } from '../../decorators/table.decorator';
import { StringDecorator } from '../../decorators/string.decorator';
import { BooleanDecorator } from '../../decorators/boolean.decorator';
import { DateTimeDecorator } from '../../decorators/datetime.decorator';
import { BooleanType, DateTimeType, StringType } from '../enums/data.type';

@TableDecorator({ name: 'CompanyDto' })
export class CompanyDto {   
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

    @StringDecorator({ label: 'Fullname', required: true, type: StringType.Text, max: 100 })
    FullName: string;

    @StringDecorator({ type: StringType.MultiText, max: 500 })
    Address: string;

    @StringDecorator({ type: StringType.Text, min: 6, max: 100 })
    Password?: string;

    @StringDecorator({ type: StringType.Text, min: 6, max: 100 })
    RawPassword?: string;

    @StringDecorator({ label: 'Leader', type: StringType.Text, max: 100 })
    Leader: string;

    @StringDecorator({ label: 'Name', required: true, type: StringType.Text, max: 100 })
    CompanyName: string;

    @StringDecorator({ label: 'Email', required: true, type: StringType.Email, max: 100 })
    CompanyEmail: string;

    @StringDecorator({ label: 'Phone', required: true, type: StringType.PhoneText, max: 15, min: 10 })
    CompanyPhone: string;

    @StringDecorator({ type: StringType.MultiText, max: 500 })
    CompanyAddress: string;
}
