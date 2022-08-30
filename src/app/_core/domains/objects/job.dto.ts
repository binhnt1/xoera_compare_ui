import { LookupData } from "../data/lookup.data";
import { BaseEntity } from "../entities/base.entity";
import { JobBiddingType } from "../enums/job.status.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { NumberDecorator } from "../../decorators/number.decorator";
import { BooleanDecorator } from "../../decorators/boolean.decorator";
import { BooleanType, NumberType, StringType } from "../enums/data.type";

@TableDecorator({ title: 'Job Bidding' })
export class JobBiddingDto extends BaseEntity {

    @StringDecorator({ type: StringType.MultiText, max: 500 })
    Reason: string;

    @NumberDecorator({ required: true, max: 100000, step: 1, decimals: 2, type: NumberType.Text })
    PriceBidding: number;

    @BooleanDecorator({ type: BooleanType.RadioButton, lookup: LookupData.ReferenceEnum(JobBiddingType) })
    Type: JobBiddingType;
}