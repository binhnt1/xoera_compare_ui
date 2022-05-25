import { BaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
import { TariffEntity } from "./tariff.entity";
import { NumberType } from "../enums/data.type";
import { LookupData } from "../data/lookup.data";
import { VehicleTypeEntity } from "./vehicle.type.entity";
import { TableDecorator } from "../../decorators/table.decorator";
import { NumberDecorator } from "../../decorators/number.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";

@TableDecorator({ title: 'Price Rule' })
export class PriceRuleEntity extends BaseEntity {

    @DropDownDecorator({ required: true, lookup: LookupData.Reference(TariffEntity) })
    TariffId: number;

    @DropDownDecorator({ required: true, lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    AccountId: number;

    @DropDownDecorator({ required: true, lookup: LookupData.Reference(VehicleTypeEntity, ['TypeName']) })
    VehTypeId: number;

    @NumberDecorator({ required: true, type: NumberType.Text, decimals: 2 })
    Rate: number;

    @NumberDecorator({ required: true, type: NumberType.Text, decimals: 2 })
    Miles: number;
}