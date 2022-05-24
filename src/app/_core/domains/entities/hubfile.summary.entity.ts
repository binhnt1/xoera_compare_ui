import { BaseEntity } from './base.entity';
import { DateTimeType, NumberType } from '../enums/data.type';
import { TableDecorator } from '../../decorators/table.decorator';
import { NumberDecorator } from '../../decorators/number.decorator';
import { DateTimeDecorator, DateTimeFormat } from '../../decorators/datetime.decorator';
import { StringDecorator } from '../../decorators/string.decorator';

@TableDecorator()
export class HubFileSummaryEntity extends BaseEntity {
    @NumberDecorator({ type: NumberType.Text })
    Time: number;

    @StringDecorator({ max: 10000 })
    FileName: string;

    @NumberDecorator({ type: NumberType.Text })
    FileCount: number;

    @NumberDecorator({ type: NumberType.Text })
    ErrorCount: number;

    @NumberDecorator({ type: NumberType.Text })
    SuccessCount: number;

    @DateTimeDecorator({ type: DateTimeType.DateTime, format: DateTimeFormat.DMYHM })
    DateTime: Date;
}