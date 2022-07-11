import { BaseEntity } from "./base.entity";
import { LicenceEntity } from "./licence.entity";
import { LookupData } from "../data/lookup.data";
import { DateTimeType, StringType } from "../enums/data.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";
import { DateTimeDecorator, DateTimeFormat } from "../../decorators/datetime.decorator";

@TableDecorator({ title: 'Device' })
export class DeviceEntity extends BaseEntity {

    @StringDecorator({ required: true, type: StringType.Text, max: 25 })
    Ip: string;

    @StringDecorator({ type: StringType.Text, max: 255 })
    Name: string;

    @StringDecorator({ type: StringType.Text, max: 150 })
    Port: string;

    @StringDecorator({ type: StringType.Text, max: 150 })
    Password: string;

    @StringDecorator({ type: StringType.Text, max: 150 })
    Location: string;

    @DropDownDecorator({ required: true, lookup: LookupData.Reference(LicenceEntity, ['DeviceId']) })
    LicenceId: number;

    @DateTimeDecorator({ type: DateTimeType.DateTime, format: DateTimeFormat.DMYHM })
    LastLogin: Date;
}