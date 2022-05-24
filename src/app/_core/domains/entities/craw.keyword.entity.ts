import { BaseEntity } from "./base.entity";
import { StringType } from "../enums/data.type";
import { LookupData } from "../data/lookup.data";
import { CrawKeywordStatus } from "../enums/craw.status";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";

@TableDecorator({ title: 'Keyword' })
export class CrawKeywordEntity extends BaseEntity {
    @StringDecorator({ label: 'Keyword', required: true, type: StringType.Text, max: 250 })
    Name: string;

    @DropDownDecorator({ required: true, lookup: LookupData.ReferenceEnum(CrawKeywordStatus) })
    Status: CrawKeywordStatus;
}