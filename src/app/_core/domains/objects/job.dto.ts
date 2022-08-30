import { NumberType } from "../enums/data.type";
import { BaseEntity } from "../entities/base.entity";
import { TableDecorator } from "../../decorators/table.decorator";
import { NumberDecorator } from "../../decorators/number.decorator";

@TableDecorator({ title: 'Job Bidding' })
export class JobBiddingDto extends BaseEntity {
    @NumberDecorator({ required: true, max: 100000, step: 1, decimals: 2, type: NumberType.Text })
    PriceBidding: number;
}