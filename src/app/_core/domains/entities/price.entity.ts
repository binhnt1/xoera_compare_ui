import { BaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
import { TariffEntity } from "./tariff.entity";
import { NumberType } from "../enums/data.type";
import { LookupData } from "../data/lookup.data";
import { VehicleTypeEntity } from "./vehicle.type.entity";
import { TableDecorator } from "../../decorators/table.decorator";
import { NumberDecorator } from "../../decorators/number.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";

@TableDecorator({ title: 'Price' })
export class PriceEntity extends BaseEntity {

    @NumberDecorator({ type: NumberType.Text, decimals: 2 })
    Drop: number;

    @NumberDecorator({ required: true, type: NumberType.Text, decimals: 2 })
    PerMile: number;

    @NumberDecorator({ type: NumberType.Text, decimals: 2 })
    Return: number;

    @NumberDecorator({ type: NumberType.Text, decimals: 2 })
    MinimumFare: number;

    @NumberDecorator({ type: NumberType.Text, decimals: 2 })
    InitialRate: number;

    @NumberDecorator({ type: NumberType.Text, decimals: 2 })
    WaitRateMin: number;

    @NumberDecorator({ type: NumberType.Text, decimals: 2 })
    InitialMiles: number;

    @DropDownDecorator({ required: true, lookup: LookupData.Reference(TariffEntity) })
    TariffId: number;

    @DropDownDecorator({ required: true, lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    AccountId: number;

    @DropDownDecorator({ required: true, lookup: LookupData.Reference(VehicleTypeEntity, ['TypeName']) })
    VehTypeId: number;
}