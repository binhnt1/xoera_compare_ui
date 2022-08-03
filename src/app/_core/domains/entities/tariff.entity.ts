import { BaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
import { LookupData } from "../data/lookup.data";
import { TableDecorator } from "../../decorators/table.decorator";
import { NumberDecorator } from "../../decorators/number.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";
import { BooleanType, DateTimeType, NumberType, StringType } from "../enums/data.type";
import { DateTimeDecorator, DateTimeFormat } from "../../decorators/datetime.decorator";
import { BooleanDecorator } from "../../decorators/boolean.decorator";

@TableDecorator({ title: 'Tariff' })
export class TariffEntity extends BaseEntity {

    @NumberDecorator({ type: NumberType.Text })
    Day: number;

    @StringDecorator({ required: true, type: StringType.Text, max: 45 })
    Name: string;

    @BooleanDecorator({ type: BooleanType.RadioButton, lookup: LookupData.ReferenceStrings(['100%', 'Add%', 'Fixed']) })
    Rule: string;

    @DropDownDecorator({ lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    AccountId: number;

    @DateTimeDecorator({ type: DateTimeType.Time, format: DateTimeFormat.HMS })
    StartTime: string;

    @DateTimeDecorator({ type: DateTimeType.Time, format: DateTimeFormat.HMS })
    EndTime: string;

    @NumberDecorator({ type: NumberType.Text, decimals: 2 })
    PriceModifyAmount: number;
}