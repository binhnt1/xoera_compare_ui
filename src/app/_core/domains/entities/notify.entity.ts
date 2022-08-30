import { UserEntity } from "./user.entity";
import { BaseEntity } from "./base.entity";
import { LookupData } from "../data/lookup.data";
import { NotifyType } from "../enums/notify.type";
import { DateTimeType, StringType } from "../enums/data.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { BooleanDecorator } from "../../decorators/boolean.decorator";
import { DateTimeDecorator } from "../../decorators/datetime.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";

@TableDecorator({ title: "Notify" })
export class NotifyEntity extends BaseEntity {
    @DropDownDecorator({ allowSearch: true, lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    UserId: number;

    @BooleanDecorator()
    IsRead: string;

    @StringDecorator({ type: StringType.Text, max: 200 })
    Title: string;

    @StringDecorator({ type: StringType.MultiText, max: 2000 })
    Content: string;

    @DropDownDecorator({ allowSearch: true, lookup: LookupData.ReferenceEnum(NotifyType) })
    Type: NotifyType;

    @DateTimeDecorator({ type: DateTimeType.DateTime })
    DateTime: Date;

    @StringDecorator({ type: StringType.Json, max: 2000 })
    JsonObject: string;
}