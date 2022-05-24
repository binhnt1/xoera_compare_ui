import { BaseEntity } from './base.entity';
import { LookupData } from '../data/lookup.data';
import { NoticeAssignType } from '../enums/notice.assign.type';
import { TableDecorator } from '../../decorators/table.decorator';
import { StringDecorator } from '../../decorators/string.decorator';
import { BooleanDecorator } from '../../decorators/boolean.decorator';
import { BooleanType, DataType, DateTimeType, StringType } from '../enums/data.type';

@TableDecorator()
export class NoticeEntity extends BaseEntity {
    @StringDecorator({ required: true, max: 50 })
    Subject: string;

    @StringDecorator({ max: 50000, type: StringType.Html })
    Content: string;

    @BooleanDecorator()
    MustAgree: boolean;

    @StringDecorator({ max: 5000 })
    AssignUsers: string;

    @BooleanDecorator({ type: BooleanType.RadioButton, lookup: LookupData.ReferenceEnum(NoticeAssignType) })
    AssignType: NoticeAssignType;

    UserIds: number[];
}