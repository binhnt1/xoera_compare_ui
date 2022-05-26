import { RoleEntity } from "./role.entity";
import { BaseEntity } from "./base.entity";
import { GenderType } from "../enums/gender.type";
import { UserStatusType } from "../enums/user.status.type";
import { DateTimeType, StringType } from "../enums/data.type";
import { ImageDecorator } from "../../decorators/image.decorator";
import { TableDecorator } from "../../decorators/table.decorator";
import { LookupData, LookupUniqueData } from "../data/lookup.data";
import { StringDecorator } from "../../decorators/string.decorator";
import { BooleanDecorator } from "../../decorators/boolean.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";
import { DateTimeDecorator } from "../../decorators/datetime.decorator";

@TableDecorator({ title: "Users" })
export class UserEntity extends BaseEntity {
    @BooleanDecorator()
    Locked: boolean;

    @DropDownDecorator({ allowSearch: true, lookup: LookupData.ReferenceEnum(UserStatusType) })
    LockedStatus: UserStatusType;

    @ImageDecorator()
    Avatar: string;

    @StringDecorator({ required: true, allowSearch: true, type: StringType.Account, max: 100 })
    FullName: string;

    @StringDecorator({ required: true, allowSearch: true, type: StringType.Email, max: 80, unique: LookupUniqueData.Reference(UserEntity, 'Email') })
    Email: string;

    @StringDecorator({ allowSearch: true, type: StringType.PhoneText, min: 10, max: 10, unique: LookupUniqueData.Reference(UserEntity, 'Phone') })
    Phone: string;

    @StringDecorator({ required: true, type: StringType.MultiText, max: 200 })
    ReasonLock: string;

    @DateTimeDecorator({ type: DateTimeType.DateTime })
    Birthday: Date;

    @StringDecorator({ type: StringType.MultiText, max: 500 })
    Description: string;

    @DropDownDecorator({ lookup: LookupData.ReferenceEnum(GenderType) })
    Gender: GenderType;

    @DropDownDecorator({ required: true, multiple: true, lookup: LookupData.Reference(RoleEntity) })
    RoleIds: number[];
}