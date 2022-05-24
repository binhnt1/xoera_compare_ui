import { BaseEntity } from "./base.entity";
import { LookupData } from "../data/lookup.data";
import { CrawStatus } from "../enums/craw.status";
import { CrawWebsiteEntity } from "./craw.website.entity";
import { CrawKeywordEntity } from "./craw.keyword.entity";
import { DateTimeType, StringType } from "../enums/data.type";
import { CrawRunHistoryEntity } from "./craw.run.history.entity";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";
import { DateTimeDecorator } from "../../decorators/datetime.decorator";

@TableDecorator({ title: 'Website keyword' })
export class CrawWebsiteKeywordEntity extends BaseEntity {

    @StringDecorator({ type: StringType.Link, max: 250 })
    LastLink: string;

    @DropDownDecorator({ required: true, lookup: LookupData.ReferenceEnum(CrawStatus) })
    Status: CrawStatus;

    @DateTimeDecorator({ type: DateTimeType.DateTime })
    LastRuning: Date;

    @DropDownDecorator({ required: true, lookup: LookupData.Reference(CrawKeywordEntity, ['Name']) })
    CrawKeywordId: number;

    @DropDownDecorator({ required: true, lookup: LookupData.Reference(CrawWebsiteEntity, ['Domain']) })
    CrawWebsiteId: number;

    @DropDownDecorator({ required: true, lookup: LookupData.Reference(CrawRunHistoryEntity, ['Index']) })
    CrawRunHistoryId: number;
}