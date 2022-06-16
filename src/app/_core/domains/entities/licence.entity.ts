import { BaseEntity } from "./base.entity";
import { CompanyEntity } from "./company.entity";
import { LookupData } from "../data/lookup.data";
import { UtilityExHelper } from "../../helpers/utility.helper";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { NumberDecorator } from "../../decorators/number.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";
import { DateTimeDecorator } from "../../decorators/datetime.decorator";
import { DateTimeType, NumberType, StringType } from "../enums/data.type";

@TableDecorator({ title: 'Licence' })
export class LicenceEntity extends BaseEntity {

    @StringDecorator({ required: true, type: StringType.Text, max: 20 })
    DeviceId: string;

    @StringDecorator({ required: true, type: StringType.AutoGenerate, max: 20, generateFunction: () => {
        return UtilityExHelper.randomText(20)
    } })
    ClientKey: string;

    @StringDecorator({ required: true, type: StringType.AutoGenerate, max: 20, generateFunction: () => {
        return UtilityExHelper.randomText(20)
    } })
    DesktopClientKey: string;

    @DateTimeDecorator({ type: DateTimeType.Date })
    ExpiryDate: string;

    @DropDownDecorator({ required: true, lookup: LookupData.Reference(CompanyEntity) })
    CompanyId: number;

    @NumberDecorator({ max: 100000, type: NumberType.Text })
    Type: number;
}