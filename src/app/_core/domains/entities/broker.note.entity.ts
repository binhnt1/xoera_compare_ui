import { BaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
import { AgencyEntity } from "./broker.entity";
import { LookupData } from "../data/lookup.data";
import { DateTimeType, StringType } from "../enums/data.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";
import { DateTimeDecorator } from "../../decorators/datetime.decorator";

@TableDecorator({ title: 'Broker Note' })
export class AgencyNoteEntity extends BaseEntity {
    @DateTimeDecorator({ type: DateTimeType.DateTime })
    DateTime: Date;

    @StringDecorator({ type: StringType.Text, max: 250 })
    Character: string;

    @StringDecorator({ type: StringType.Text, max: 250 })
    Title: string;

    @StringDecorator({ type: StringType.Text, max: 250 })
    User: string;

    @StringDecorator({ required: true, type: StringType.MultiText, max: 1000 })
    Content: string;
    
    @DropDownDecorator({ label: 'User', lookup: LookupData.Reference(UserEntity, ['FullName']) })
    UserId: number;

    @DropDownDecorator({ label: 'Broker', lookup: LookupData.Reference(AgencyEntity, ['AgencyName']) })
    AgencyId: number;

    @DropDownDecorator({ label: 'Parent', lookup: LookupData.Reference(AgencyNoteEntity, ['Title']) })
    ParentId: number;
}