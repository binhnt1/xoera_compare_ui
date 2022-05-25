import { BaseEntity } from "./base.entity";
import { TableDecorator } from "../../decorators/table.decorator";
import { ImageDecorator } from "../../decorators/image.decorator";
import { NumberDecorator } from "../../decorators/number.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { NumberType, StoreType, StringType } from "../enums/data.type";

@TableDecorator({ title: 'Vehicle Type' })
export class VehicleTypeEntity extends BaseEntity {

    @StringDecorator({ max: 12 })
    ColourCode: string;

    @StringDecorator({ required: true, max: 25 })
    TypeName: string;

    @StringDecorator({ required: true, max: 25 })
    ServiceType: string;

    @ImageDecorator({ store: StoreType.Database })
    WebIcon: string;

    @ImageDecorator({ store: StoreType.Database })
    DesktopIcon: string;

    @NumberDecorator({ type: NumberType.Numberic })
    NoOfLuggeges: number;

    @NumberDecorator({ type: NumberType.Numberic })
    NoOfHandBags: number;

    @NumberDecorator({ type: NumberType.Numberic })
    NoOfPassengers: number;

    @NumberDecorator({ type: NumberType.Numberic })
    MaxNoOfLuggages: number;

    @NumberDecorator({ type: NumberType.Numberic })
    MaxNoOfHandBags: number;

    @NumberDecorator({ type: NumberType.Text, decimals: 2 })
    PriceModifyAmount: number;

    @StringDecorator({ max: 500, type: StringType.MultiText })
    Description: string;
}