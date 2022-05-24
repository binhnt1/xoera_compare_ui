import { BaseEntity } from './base.entity';
import { DataType, DateTimeType } from '../enums/data.type';
import { TableDecorator } from '../../decorators/table.decorator';
import { NumberDecorator } from '../../decorators/number.decorator';
import { DateTimeDecorator, DateTimeFormat } from '../../decorators/datetime.decorator';

@TableDecorator()
export class CclEntity extends BaseEntity {
    @NumberDecorator({ required: true, decimals: 0 })
    Year: number;

    @NumberDecorator({ required: true, step: 0.001, decimals: 3 })
    Value: number;

    @DateTimeDecorator({ type: DateTimeType.DateTime, format: DateTimeFormat.DMYHM })
    EffectiveFrom: Date;

    @DateTimeDecorator({ type: DateTimeType.DateTime, format: DateTimeFormat.DMYHM })
    EffectiveUltil: Date;
}