import { BaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
import { TariffEntity } from "./tariff.entity";
import { NumberType } from "../enums/data.type";
import { LookupData } from "../data/lookup.data";
import { VehicleTypeEntity } from "./vehicle.type.entity";
import { TableDecorator } from "../../decorators/table.decorator";
import { NumberDecorator } from "../../decorators/number.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { BooleanDecorator } from "../../decorators/boolean.decorator";

@TableDecorator({ title: 'Fixed Price' })
export class FixedPriceEntity extends BaseEntity {

    @StringDecorator({ max: 50 })
    End: string;

    @StringDecorator({ max: 50 })
    Start: string;

    @NumberDecorator({ type: NumberType.Text, decimals: 2 })
    Drop: number;

    @NumberDecorator({ required: true, type: NumberType.Text, decimals: 2 })
    Price: number;

    @NumberDecorator({ type: NumberType.Text, decimals: 2 })
    Return: number;
    
    @BooleanDecorator() 
    ReverseDirection: boolean;

    @DropDownDecorator({ required: true, lookup: LookupData.Reference(TariffEntity) })
    TariffId: number;

    @DropDownDecorator({ required: true, lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    AccountId: number;

    @DropDownDecorator({ required: true, lookup: LookupData.Reference(VehicleTypeEntity, ['TypeName']) })
    VehTypeId: number;
}