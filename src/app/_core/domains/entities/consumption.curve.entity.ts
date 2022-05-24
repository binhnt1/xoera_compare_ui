import { BaseEntity } from './base.entity';
import { TableDecorator } from '../../decorators/table.decorator';
import { NumberDecorator } from '../../decorators/number.decorator';
import { StringDecorator } from '../../decorators/string.decorator';

@TableDecorator()
export class ConsumptionCurveEntity extends BaseEntity {
    @NumberDecorator({ required: true, decimals: 0 })
    Year: number;

    @NumberDecorator({ required: true, step: 1 })
    MonthValue: number;

    @NumberDecorator({ step: 0.001, decimals: 3 })
    Usage: number;

    @StringDecorator({ max: 3 })
    Month: string;
}