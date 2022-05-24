import { BaseEntity } from './base.entity';
import { DateTimeType, NumberType } from '../enums/data.type';
import { TableDecorator } from '../../decorators/table.decorator';
import { StringDecorator } from '../../decorators/string.decorator';
import { NumberDecorator } from '../../decorators/number.decorator';
import { DateTimeDecorator } from '../../decorators/datetime.decorator';

@TableDecorator()
export class MeterReadEntity extends BaseEntity {
    @StringDecorator({ max: 14 })
    MeterSerialNumber: string;

    @DateTimeDecorator({ type: DateTimeType.Date })
    ActualReadDate: Date;

    @StringDecorator({ max: 250 })
    MeterReading: string;

    @StringDecorator({ max: 250 })
    MeterReadingSource: string;

    @StringDecorator({ max: 250 })
    MeterReadingReason: string;

    @NumberDecorator({ type: NumberType.Text })
    MeterRoundTheClock: number;

    @StringDecorator({ max: 250 })
    MeterReadingReasonCode: string;

    @StringDecorator({ max: 250 })
    MeterReadingSourceCode: string;    

    @StringDecorator({ max: 250 })
    Status: string;     

    @StringDecorator({ max: 9 })
    Read: string;   
}