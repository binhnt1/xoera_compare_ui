import { BaseEntity } from "./base.entity";
import { LookupData } from "../data/lookup.data";
import { BrokerLeadEntity } from "./broker.lead.entity";
import { DateTimeType, StringType } from "../enums/data.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { DateTimeDecorator } from "../../decorators/datetime.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";

@TableDecorator({ title: 'Sent Item' })
export class SentItemEntity extends BaseEntity {

    @StringDecorator({ type: StringType.Email })
    Email: string;

    @DateTimeDecorator({ type: DateTimeType.DateTime })
    TimeSent: Date;

    @StringDecorator({ required: true, type: StringType.Text, max: 250 })
    Subject: string;

    @DropDownDecorator({ label: 'Broker', lookup: LookupData.Reference(BrokerLeadEntity, ['BusinessName']) })
    BrokerLeadId: number;

    @StringDecorator({ type: StringType.Html, max: 10000 })
    Content: string;
}