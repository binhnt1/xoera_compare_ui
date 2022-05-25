import { BaseEntity } from "./base.entity";
import { LookupData } from "../data/lookup.data";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { NumberDecorator } from "../../decorators/number.decorator";
import { BooleanDecorator } from "../../decorators/boolean.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";
import { DateTimeType, NumberType, StringType } from "../enums/data.type";
import { DateTimeDecorator, DateTimeFormat } from "../../decorators/datetime.decorator";

@TableDecorator({ title: 'Zone' })
export class ZoneEntity extends BaseEntity {

    @BooleanDecorator()
    Editable: boolean;

    @BooleanDecorator()
    IsBookingFrozen: boolean;

    @NumberDecorator({ type: NumberType.Text })
    LeadTime: number;

    @StringDecorator({ type: StringType.Text, max: 28 })
    Region: string;

    @StringDecorator({ type: StringType.Text, max: 250 })
    Area: string;

    @NumberDecorator({ type: NumberType.Text, decimals: 8 })
    Lat: number;

    @NumberDecorator({ type: NumberType.Text, decimals: 8 })
    Lng: number;

    @NumberDecorator({ type: NumberType.Text, decimals: 2 })
    Radius: number;

    @NumberDecorator({ type: NumberType.Text, decimals: 2 })
    PickupCharge: number;

    @NumberDecorator({ type: NumberType.Text, decimals: 2 })
    ParkingPickup: number;

    @NumberDecorator({ type: NumberType.Text, decimals: 2 })
    ParkingDropoff: number;

    @NumberDecorator({ type: NumberType.Text, decimals: 2 })
    MinDropoffDistance: number;

    @NumberDecorator({ type: NumberType.Text, decimals: 2 })
    MaxDropoffDistance: number;

    @StringDecorator({ required: true, type: StringType.Text, max: 45 })
    ZoneName: string;

    @StringDecorator({ required: true, type: StringType.Text, max: 20 })
    ZoneType: string;

    @DateTimeDecorator({ type: DateTimeType.DateTime, format: DateTimeFormat.DMYHM })
    FreezeStarts: Date;

    @DateTimeDecorator({ type: DateTimeType.DateTime, format: DateTimeFormat.DMYHM })
    FreezeExpires: Date;

    @DropDownDecorator({ lookup: LookupData.Reference(ZoneEntity, ['ZoneName']) })
    FirstBackupZoneId: number;

    @DropDownDecorator({ lookup: LookupData.Reference(ZoneEntity, ['ZoneName']) })
    SecondBackupZoneId: number;

    @DropDownDecorator({ lookup: LookupData.Reference(ZoneEntity, ['ZoneName']) })
    ThirdBackupZoneId: number;

    @DropDownDecorator({ lookup: LookupData.Reference(ZoneEntity, ['ZoneName']) })
    FourthBackupZoneId: number;
}