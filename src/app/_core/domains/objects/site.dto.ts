import { SiteType } from "../enums/site.type";
import { LookupData } from "../data/lookup.data";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { NumberDecorator } from "../../decorators/number.decorator";
import { BooleanDecorator } from "../../decorators/boolean.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";
import { DateTimeDecorator } from "../../decorators/datetime.decorator";
import { BooleanType, DateTimeType, NumberType, StringType } from "../enums/data.type";

TableDecorator()
export class SiteDto {
    @NumberDecorator()
    Id: number;

    @BooleanDecorator({ lookup: LookupData.ReferenceEnum(SiteType), type: BooleanType.RadioButton })
    Type: SiteType;

    @StringDecorator({ max: 250 })
    BusinessName: string;

    @StringDecorator({ max: 250 })
    CompanyNumber: string;

    @DropDownDecorator({ lookup: LookupData.ReferenceStrings(['Mr', 'Miss', 'Mrs', 'Ms']), placeholder: 'Title' })
    ContactTitle: string;

    @StringDecorator({ max: 250, placeholder: 'First Name' })
    ContactFirstName: string;

    @StringDecorator({ max: 250, placeholder: 'Surname' })
    ContactSurname: string;

    @DateTimeDecorator({ type: DateTimeType.Date, view: 'years'  })
    DateOfBirth: Date;

    @StringDecorator({ max: 150, type: StringType.Email })
    ContactEmail: string;

    @StringDecorator({ max: 150, type: StringType.PhoneText })
    ContactPhone: string;

    @StringDecorator({ max: 150, type: StringType.Code })
    Mprn: string;

    @DropDownDecorator({ lookup: LookupData.ReferenceStrings(['1', '2', '3', '4']) })
    MeterPointClass: string;

    @NumberDecorator({ type: NumberType.Numberic })
    RollingAQ: number;

    @DateTimeDecorator({ type: DateTimeType.Date })
    ProposedSupplyStartDate: Date;

    @StringDecorator({ max: 250 })
    BuildingName: string;

    @StringDecorator({ max: 250 })
    BuildingNumber: string;

    @StringDecorator({ max: 250 })
    Street: string;

    @StringDecorator({ max: 250 })
    PostTown: string;

    @StringDecorator({ max: 250 })
    PostCode: string;
}