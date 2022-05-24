import { BaseEntity } from "./base.entity";
import { AgencyEntity } from "./broker.entity";
import { LookupData } from "../data/lookup.data";
import { StringType } from "../enums/data.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";

@TableDecorator({ title: 'Broker Contact' })
export class AgencyContactEntity extends BaseEntity {
    @StringDecorator({ type: StringType.Text, max: 250 })
    Title: string;

    @StringDecorator({ type: StringType.Text, max: 250 })
    Firstname: string;

    @StringDecorator({ type: StringType.Text, max: 250 })
    Surname: string;
    
    @StringDecorator({ type: StringType.Text, max: 250 })
    Position: string;
    
    @StringDecorator({ type: StringType.Email, max: 250 })
    Email: string;
    
    @StringDecorator({ required: true, type: StringType.PhoneText, max: 50 })
    Telephone: string;
    
    @StringDecorator({ required: true, type: StringType.PhoneText, max: 50 })
    Mobile: string;

    @DropDownDecorator({ label: 'Broker', lookup: LookupData.Reference(AgencyEntity, ['AgencyName']) })
    AgencyId: number;
}