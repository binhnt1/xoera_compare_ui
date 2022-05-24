import { BaseEntity } from "./base.entity";
import { LookupData } from "../data/lookup.data";
import { CrawWebsiteStatus } from "../enums/craw.status";
import { TableDecorator } from "../../decorators/table.decorator";
import { NumberDecorator } from "../../decorators/number.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";
import { DateTimeDecorator } from "../../decorators/datetime.decorator";
import { DateTimeType, NumberType, StringType } from "../enums/data.type";

@TableDecorator({ title: 'Website' })
export class CrawWebsiteEntity extends BaseEntity {
    @StringDecorator({ required: true, type: StringType.Link, max: 250 })
    Domain: string;

    @StringDecorator({ required: true, type: StringType.MultiText, rows: 20, max: 500000 })
    JsonConfig: string;

    @DropDownDecorator({ required: true, lookup: LookupData.ReferenceEnum(CrawWebsiteStatus) })
    Status: CrawWebsiteStatus;

    @NumberDecorator({ max: 1000, type: NumberType.Numberic, subfix: 'seconds' })
    DelayTime: number;

    @StringDecorator({ type: StringType.Link, max: 250 })
    LastLink: string;

    @DateTimeDecorator({ type: DateTimeType.DateTime })
    LastRuning: Date;

    Keywords: any;
    TotalKeyword: number;
}