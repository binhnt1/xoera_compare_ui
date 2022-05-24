import { BaseEntity } from './base.entity';
import { SiteType } from '../enums/site.type';
import { LookupData } from '../data/lookup.data';
import { BooleanType } from '../enums/data.type';
import { TableDecorator } from '../../decorators/table.decorator';
import { StringDecorator } from '../../decorators/string.decorator';
import { BooleanDecorator } from '../../decorators/boolean.decorator';

@TableDecorator()
export class SiteEntity extends BaseEntity {
    @StringDecorator({ max: 250 })
    Type: string;

    @BooleanDecorator({ lookup: LookupData.ReferenceEnum(SiteType), type: BooleanType.RadioButton })
    SiteType: SiteType;

    @StringDecorator({ max: 250 })
    SiteRef: string;

    @StringDecorator({ max: 250 })
    SiteName: string;

    @StringDecorator({ max: 250 })
    BuildingName: string;

    @StringDecorator({ max: 250 })
    BuildingNumber: string;

    @StringDecorator({ max: 250 })
    Street: string;

    @StringDecorator({ max: 250 })
    Locality: string;

    @StringDecorator({ max: 250 })
    PostTown: string;

    @StringDecorator({ max: 250 })
    PostCode: string;

    @StringDecorator({ max: 250 })
    BillingStreet: string;

    @StringDecorator({ max: 250 })
    AccountNumber: string;

    @StringDecorator({ max: 250 })
    AccountStatus: string;

    @StringDecorator({ max: 250 })
    BillingPostcode: string;

    @StringDecorator({ max: 250 })
    PrincipalStreet: string;

    @StringDecorator({ max: 4 })
    PostcodeIncode: string;

    @StringDecorator({ max: 4 })
    PostcodeOutcode: string;
}