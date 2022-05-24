import { BaseEntity } from './base.entity';
import { DateTimeType, NumberType } from '../enums/data.type';
import { TableDecorator } from '../../decorators/table.decorator';
import { StringDecorator } from '../../decorators/string.decorator';
import { NumberDecorator } from '../../decorators/number.decorator';
import { BooleanDecorator } from '../../decorators/boolean.decorator';
import { DateTimeDecorator } from '../../decorators/datetime.decorator';

@TableDecorator()
export class MeterPointEntity extends BaseEntity {
    @StringDecorator({ max: 50 })
    Mpr: string;

    @StringDecorator({ max: 250 })
    Status: string;

    @StringDecorator({ max: 250 })
    MprnStatusCode: string;

    @DateTimeDecorator({ type: DateTimeType.Date })
    MprnStatusChangeDate: Date;

    @DateTimeDecorator({ type: DateTimeType.Date })
    SupplyStartDate: Date;

    @DateTimeDecorator({ type: DateTimeType.Date })
    SupplyEndDate: Date;

    @NumberDecorator({ type: NumberType.Text })
    RollingAq: number;

    @NumberDecorator({ type: NumberType.Text })
    FormulaYearSmpaq: number;

    @NumberDecorator({ type: NumberType.Text })
    AlternativeAq: number;

    @BooleanDecorator({ description: 'Use Alt AQ' })
    UseAlternativeAq: boolean;

    @NumberDecorator({ type: NumberType.Text })
    SupplyMeterPointClass: number;

    @StringDecorator({ max: 250 })
    Category: string;

    @StringDecorator({ max: 250 })
    MarketSectorCode: string;

    @NumberDecorator({ decimals: 2, step: 0.01, type: NumberType.Text })
    CorrectionFactor: number;

    @StringDecorator({ max: 250 })
    DniIndicator: string;

    @StringDecorator({ max: 250 })
    SeasonalLspIndicator: string;

    @StringDecorator({ max: 250 })
    MeterReadBatchFrequency: string;

    @StringDecorator({ max: 250 })
    RegistrationStatus: string;

    @StringDecorator({ max: 250 })
    NominationShipperReference: string;

    @StringDecorator({ max: 250 })
    PreviousSupplier: string;

    @StringDecorator({ max: 250 })
    PreviousSupplierShortCode: string;

    @NumberDecorator()
    EndUserCategory: number;

    @StringDecorator({ max: 250 })
    LdzIdentifier: string;

    @StringDecorator({ max: 250 })
    ExitZoneIdentifier: string;

    @NumberDecorator({ decimals: 2, step: 0.01, type: NumberType.Text })
    ExitCapacityLdzEcnChargeRate: number;

    @NumberDecorator({ decimals: 2, step: 0.01, type: NumberType.Text })
    LdzCustomerChargeRate: number;

    @NumberDecorator({ decimals: 2, step: 0.01, type: NumberType.Text })
    LdzCapacityChargeRate: number;

    @NumberDecorator({ decimals: 2, step: 0.01, type: NumberType.Text })
    LdzCommodityChargeRate: number;

    @NumberDecorator({ decimals: 2, step: 0.01, type: NumberType.Text })
    NtsExitCommodityChargeRate: number;
}