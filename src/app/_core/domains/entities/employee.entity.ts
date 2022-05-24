import { BaseEntity } from "./base.entity";
import { StringType } from "../enums/data.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";

@TableDecorator()
export class EmployeeEntity extends BaseEntity {
    @StringDecorator({ type: StringType.Text, max: 250 })
    FirstName: string;

    @StringDecorator({ type: StringType.Text, max: 250 })
    LastName: string;
    
    @StringDecorator({ required: true, type: StringType.PhoneText, max: 50 })
    Phone1: string;
    
    @StringDecorator({ required: true, type: StringType.PhoneText, max: 50 })
    Phone2: string;
    
    @StringDecorator({ type: StringType.Email, max: 250 })
    Email: string;
    
    @StringDecorator({ type: StringType.Account, max: 250 })
    Nokname: string;
    
    @StringDecorator({ type: StringType.Email, max: 250 })
    Email2: string;
}