import { BaseEntity } from "./base.entity";
import { StringType } from "../enums/data.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { BooleanDecorator } from "../../decorators/boolean.decorator";

@TableDecorator()
export class BrokerLeadEntity extends BaseEntity {
    @StringDecorator({ required: true, type: StringType.Text, max: 250 })
    AgencyNumber: string;

    @StringDecorator({ required: true, type: StringType.Text, max: 250 })
    BusinessName: string;

    @StringDecorator({ type: StringType.Account, max: 250 })
    ContactName: string;
    
    @StringDecorator({ type: StringType.MultiText, max: 500 })
    Address: string;
    
    @StringDecorator({ required: true, type: StringType.PhoneText, max: 50 })
    Phone1: string;
    
    @StringDecorator({ type: StringType.Email, max: 250 })
    Email1: string;
    
    @StringDecorator({ type: StringType.PhoneText, max: 250 })
    Mobile1: string;
    
    @StringDecorator({ required: true, type: StringType.PhoneText, max: 50 })
    Phone2: string;
    
    @StringDecorator({ type: StringType.Email, max: 250 })
    Email2: string;
    
    @StringDecorator({ type: StringType.PhoneText, max: 250 })
    Mobile2: string;
    
    @StringDecorator({ type: StringType.Email, max: 250 })
    Email3: string;
    
    @StringDecorator({ type: StringType.Link, max: 250 })
    Website: string;

    @BooleanDecorator()
    Active: boolean;

    @BooleanDecorator()
    Deleted: boolean;
    
    @StringDecorator({ type: StringType.Text, max: 500 })
    JobRole: string;
}