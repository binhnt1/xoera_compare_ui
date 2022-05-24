import { BaseEntity } from './base.entity';
import { LookupData } from '../data/lookup.data';
import { DateTimeType, NumberType } from '../enums/data.type';
import { ConstantHelper } from '../../helpers/constant.helper';
import { TableDecorator } from '../../decorators/table.decorator';
import { StringDecorator } from '../../decorators/string.decorator';
import { NumberDecorator } from '../../decorators/number.decorator';
import { DropDownDecorator } from '../../decorators/dropdown.decorator';
import { DateTimeDecorator } from '../../decorators/datetime.decorator';

@TableDecorator()
export class MeterEntity extends BaseEntity {
    @DropDownDecorator({ lookup: LookupData.ReferenceItems(ConstantHelper.METER_STATUS_TYPES)})
    MeterStatus: string;

    @StringDecorator({ max: 14 })
    MeterSerialNumber: string;

    @StringDecorator({ max: 250 })
    MeterModelName: string;

    @StringDecorator({ max: 250 })
    MeterMechanism: string;

    @StringDecorator({ max: 5 })
    PaymentMethodCode: string;

    @DropDownDecorator({ lookup: LookupData.ReferenceItems(ConstantHelper.LOCATION_CODES) })
    MeterLocationCode: string;

    @StringDecorator({ max: 250 })
    MeterType: string;

    @StringDecorator({ max: 250 })
    MeterCollarFittedIndicator: string;

    @DateTimeDecorator({ type: DateTimeType.Date })
    LastInspectionDate: Date;

    @StringDecorator({ max: 250 })
    MeterManufacturerCode: string;

    @NumberDecorator({ type: NumberType.Text })
    MeterManufacturedYear: number;

    @DateTimeDecorator({ type: DateTimeType.Date })
    MeterInstallationDate: Date;

    @DateTimeDecorator({ type: DateTimeType.Date })
    EndDate: Date;

    @DropDownDecorator({ lookup: LookupData.ReferenceStrings(['Y', 'N']) })
    ImperialMeterIndicator: string;

    @NumberDecorator({ type: NumberType.Text })
    NumberOfDialsOrDigits: number;

    @DropDownDecorator({ lookup: LookupData.ReferenceNumbers([1, 10, 100, 1000]) })
    MeterReadingUnits: number;

    @DropDownDecorator({ lookup: LookupData.ReferenceItems(ConstantHelper.METER_MRF_TYPES) })
    MrfTypeCode: string;

    @NumberDecorator({ decimals: 2, step: 0.01 })
    MeterReadingFactor: number;

    @NumberDecorator({ decimals: 2, step: 0.01 })
    MeterPulseValue: number;

    @StringDecorator({ max: 250 })
    GasActOwner: string;

    @StringDecorator({ max: 250 })
    CurrentMeterAssetManager: string;

    @StringDecorator({ max: 250 })
    ProspectiveMeterAssetManager: string;

    @DateTimeDecorator({ type: DateTimeType.Date })
    ProspectiveMamEffective: Date;

    @NumberDecorator({ type: NumberType.Text })
    CorrectedReadingUnits: number;

    @NumberDecorator({ type: NumberType.Text })
    UncorrectedReadingUnits: number;

    @StringDecorator({ max: 250 })
    ConvertorModel: string;

    @StringDecorator({ max: 250 })
    ConvertorManufacturer: string;

    @NumberDecorator({ type: NumberType.Text })
    ConvertorManufacturedYear: number;

    @StringDecorator({ max: 250 })
    ConvertorSerialNumber: string;

    @NumberDecorator({ decimals: 2, step: 0.01 })
    ConvertorCorrectionFactor: string;

    @StringDecorator({ max: 250 })
    AmrIndicator: string;

    @NumberDecorator({ type: NumberType.Text })
    SmsoEfd: number;

    @NumberDecorator({ type: NumberType.Text })
    DccServiceFlagEfd: number;

    @DateTimeDecorator({ type: DateTimeType.Date })
    FirstSmetsInstallationDate: Date;

    @StringDecorator({ max: 250 })
    NwoShortCode: string;

    @StringDecorator({ max: 250 })
    SmsoId: string;

    @StringDecorator({ max: 250 })
    DccServiceFlag: string;

    @StringDecorator({ max: 250 })
    IhdInstallStatus: string;

    @StringDecorator({ max: 250 })
    UniquePropertyRefNo: string;

    @NumberDecorator({ type: NumberType.Text })
    NetworkOwnerIdEfd: number;    

    @StringDecorator({ max: 100 })
    MeterLocationDescription: string;

    @NumberDecorator({ type: NumberType.Text })
    MeasuringCapacity: number;
}