import { BaseEntity } from "./base.entity";
import { LookupData } from "../data/lookup.data";
import { DateTimeType, StringType } from "../enums/data.type";
import { UserActivityType } from "../enums/user.activity.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { BooleanDecorator } from "../../decorators/boolean.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";
import { DateTimeDecorator } from "../../decorators/datetime.decorator";

@TableDecorator({ title: 'Activity log' })
export class UserActivityEntity extends BaseEntity {

    @StringDecorator({ allowSearch: true, type: StringType.Link })
    Ip: string;

    @StringDecorator({ type: StringType.Text })
    Os: string;

    @DateTimeDecorator({ allowSearch: true, type: DateTimeType.DateTime })
    DateTime: string;

    @StringDecorator({ type: StringType.Text })
    Country: string;

    @StringDecorator({ type: StringType.Text })
    Browser: string;

    @BooleanDecorator()
    Incognito: string;

    @DropDownDecorator({ allowSearch: true, lookup: LookupData.ReferenceEnum(UserActivityType) })
    Type: UserActivityType;
}