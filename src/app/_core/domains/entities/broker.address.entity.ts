import { BaseEntity } from "./base.entity";
import { AgencyEntity } from "./broker.entity";
import { LookupData } from "../data/lookup.data";
import { DateTimeType, StringType } from "../enums/data.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { DateTimeDecorator } from "../../decorators/datetime.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";

@TableDecorator({ title: 'Broker Address' })
export class AgencyAddressEntity extends BaseEntity {
    @StringDecorator({ type: StringType.Code, max: 50 })
    Postcode: string;

    @StringDecorator({ required: true, type: StringType.Text, max: 250 })
    BuildingName: string;

    @StringDecorator({ type: StringType.Text, max: 250 })
    BuildingNumber: string;
    
    @StringDecorator({ type: StringType.Text, max: 500 })
    AddressLine1: string;
    
    @StringDecorator({ type: StringType.Text, max: 500 })
    AddressLine2: string;
    
    @StringDecorator({ type: StringType.Text, max: 250 })
    Town: string;
    
    @StringDecorator({ type: StringType.Text, max: 250 })
    City: string;

    @DateTimeDecorator({ type: DateTimeType.Date })
    EffectiveFrom: Date;

    @DateTimeDecorator({ type: DateTimeType.Date })
    EffectiveUntil: Date;

    @DropDownDecorator({ label: 'Broker', lookup: LookupData.Reference(AgencyEntity, ['AgencyName']) })
    AgencyId: number;
}