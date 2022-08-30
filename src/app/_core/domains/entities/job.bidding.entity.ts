import { JobEntity } from "./job.entity";
import { BaseEntity } from "./base.entity";
import { CompanyEntity } from "./company.entity";
import { LookupData } from "../data/lookup.data";
import { JobStatusType } from "../enums/job.status.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { NumberDecorator } from "../../decorators/number.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";
import { DateTimeDecorator } from "../../decorators/datetime.decorator";
import { DateTimeType, NumberType, StringType } from "../enums/data.type";

@TableDecorator({ title: 'Job Bidding' })
export class JobBiddingEntity extends BaseEntity {

    @DropDownDecorator({ lookup: LookupData.Reference(JobEntity, ['BookerRef']) })
    JobId: number;

    @DropDownDecorator({ lookup: LookupData.Reference(CompanyEntity, ['Name']) })
    CompanyId: number;

    @StringDecorator({ type: StringType.MultiText, max: 500 })
    Reason: string;

    @DateTimeDecorator({ type: DateTimeType.DateTime })
    AcceptedAt: Date;

    @DropDownDecorator({ lookup: LookupData.ReferenceEnum(JobStatusType) })
    Status: JobStatusType;

    @NumberDecorator({ max: 100000, step: 1, decimals: 2, type: NumberType.Text })
    PriceBidding: number;
}