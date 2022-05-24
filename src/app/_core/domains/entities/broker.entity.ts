import { BaseEntity } from "./base.entity";
import { LookupData } from "../data/lookup.data";
import { EmployeeEntity } from "./employee.entity";
import { SecurityRightEntity } from "./security.right.entity";
import { ImageDecorator } from "../../decorators/image.decorator";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { NumberDecorator } from "../../decorators/number.decorator";
import { NumberType, StoreType, StringType } from "../enums/data.type";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";

@TableDecorator({ title: 'Broker' })
export class AgencyEntity extends BaseEntity {
    @StringDecorator({ label: 'Broker Number', type: StringType.Text, max: 250 })
    AgencyNumber: string;

    @ImageDecorator({ label: 'Broker Logo', store: StoreType.Database })
    AgencyLogoBase64: string;

    @StringDecorator({ label: 'Broker Name', type: StringType.Text, max: 250 })
    AgencyName: string;
    
    @DropDownDecorator({ lookup: LookupData.ReferenceStrings(['Active', 'InActive', 'Joined', 'Bad Data']) })
    Status: string;
    
    @StringDecorator({ type: StringType.Text, max: 250 })
    CompanyRegNumber: string;
    
    @DropDownDecorator({ lookup: LookupData.ReferenceStrings(["PLC", "Charity", "Sole Trader", "Business Partnership", "Limited company (LTD)", "Limited Partnership", "Limited Liability Partnership (LLP)"]) })
    TradingType: string;
    
    @StringDecorator({ type: StringType.Text, max: 250 })
    VatNumber: string;
    
    @StringDecorator({ type: StringType.Link, max: 250 })
    Website: string;

    @NumberDecorator({ type: NumberType.Text })
    MaxUserAllowed: number;

    @StringDecorator({ type: StringType.Text, max: 250 })
    PrincipalContact: string;

    @StringDecorator({ type: StringType.PhoneText, max: 20 })
    Telephone: string;

    @StringDecorator({ type: StringType.Email, max: 250 })
    EmailAddress: string;

    @StringDecorator({ type: StringType.Text, max: 50 })
    Fax: string;
    
    @DropDownDecorator({ label: 'Account Manager', lookup: LookupData.Reference(EmployeeEntity, ['FirstName', 'LastName']) })
    EmployeeId: number;

    @StringDecorator({ type: StringType.MultiText, max: 500 })
    Notes: string;

    Permissions: SecurityRightEntity[];
}