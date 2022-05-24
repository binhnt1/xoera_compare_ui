import { BaseEntity } from "./base.entity";
import { StringType } from "../enums/data.type";
import { LookupData } from "../data/lookup.data";
import { YesNoType } from "../enums/boolean.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";

@TableDecorator()
export class BrokerLeadTempEntity extends BaseEntity {
    @StringDecorator({ type: StringType.Text, max: 250 })
    Name: string;

    @StringDecorator({ type: StringType.Link, max: 500 })
    Link: string;
    
    @StringDecorator({ type: StringType.Link, max: 250 })
    Domain: string;
    
    @StringDecorator({ type: StringType.Link, max: 250 })
    Website: string;
    
    @StringDecorator({ type: StringType.PhoneText, max: 50 })
    Phone: string;
    
    @StringDecorator({ type: StringType.PhoneText, max: 50 })
    Mobile: string;

    @StringDecorator({ type: StringType.Text, max: 250 })
    OtherName: string;
    
    @StringDecorator({ type: StringType.Email, max: 250 })
    Email: string;

    @StringDecorator({ type: StringType.Account, max: 250 })
    Owner: string;
    
    @StringDecorator({ type: StringType.MultiText, max: 500 })
    Address: string;

    @DropDownDecorator({ lookup: LookupData.ReferenceEnum(YesNoType) })
    Irrelevant: boolean;

    @DropDownDecorator({ lookup: LookupData.ReferenceEnum(YesNoType) })
    BrokerLeadCreated: boolean;
}