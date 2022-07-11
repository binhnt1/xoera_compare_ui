import { BaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
import { LookupData } from "../data/lookup.data";
import { DateTimeType } from "../enums/data.type";
import { AgreementEntity } from "./agreement.entity";
import { TableDecorator } from "../../decorators/table.decorator";
import { BooleanDecorator } from "../../decorators/boolean.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";
import { DateTimeDecorator, DateTimeFormat } from "../../decorators/datetime.decorator";

@TableDecorator({ title: 'User Agreement' })
export class UserAgreementEntity extends BaseEntity {

    @DropDownDecorator({ required: true, lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    UserId: number;

    @DropDownDecorator({ required: true, lookup: LookupData.Reference(AgreementEntity, ['Name']) })
    AgreementId: number;

    @BooleanDecorator()
    Agreed: boolean;

    @DateTimeDecorator({ type: DateTimeType.DateTime, format: DateTimeFormat.DMYHM })
    AgreedOn: Date;
}