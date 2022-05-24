import { BaseEntity } from "./base.entity";
import { LookupData } from "../data/lookup.data";
import { CrawRunningStatus } from "../enums/craw.status";
import { DateTimeType, StringType } from "../enums/data.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { NumberDecorator } from "../../decorators/number.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";
import { DateTimeDecorator } from "../../decorators/datetime.decorator";

@TableDecorator({ title: 'Run history' })
export class CrawRunHistoryEntity extends BaseEntity {
    @NumberDecorator()
    Index: number;

    @DateTimeDecorator({ type: DateTimeType.DateTime })
    RunTime: Date;

    @DropDownDecorator({ required: true, lookup: LookupData.ReferenceEnum(CrawRunningStatus) })
    Status: CrawRunningStatus;

    @StringDecorator({ type: StringType.Link, max: 250 })
    LastLink: string;

    @DateTimeDecorator({ type: DateTimeType.DateTime })
    LastRuning: Date;

    Websites: any[];
    Keywords: any[];
    TotalWebsite: number;
    TotalKeyword: number;
}