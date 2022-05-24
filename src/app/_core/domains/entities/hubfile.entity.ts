import { BaseEntity } from './base.entity';
import { SiteEntity } from './site.entity';
import { MeterEntity } from './meter.entity';
import { ONUPDType } from '../enums/onupd.type';
import { LookupData } from '../data/lookup.data';
import { MeterReadEntity } from './meter.read.entity';
import { ONADeAppType, ONAType } from '../enums/ona.type';
import { ConstantHelper } from '../../helpers/constant.helper';
import { HubFileStateType } from '../enums/hubfile.state.type';
import { FileDecorator } from '../../decorators/file.decorator';
import { TableDecorator } from '../../decorators/table.decorator';
import { NumberDecorator } from '../../decorators/number.decorator';
import { StringDecorator } from '../../decorators/string.decorator';
import { BooleanDecorator } from '../../decorators/boolean.decorator';
import { DateTimeDecorator } from '../../decorators/datetime.decorator';
import { DropDownDecorator } from '../../decorators/dropdown.decorator';
import { MeterWorkRequestType } from '../enums/meter.work.request.type';
import { BooleanType, DateTimeType, NumberType, StringType } from '../enums/data.type';

@TableDecorator()
export class HubFileEntity extends BaseEntity {
    @StringDecorator({ max: 250 })
    FileName: number;

    @StringDecorator({ max: 250 })
    FileExt: number;

    @StringDecorator({ max: 250 })
    Type: number;

    @StringDecorator({ max: 250 })
    Mprn: number;

    @StringDecorator({ max: 250 })
    NomShipperRef: number;

    @StringDecorator({ max: 250 })
    TransactionType: number;

    @DropDownDecorator({ lookup: LookupData.Reference(SiteEntity, ['SiteName']) })
    SiteId: number;

    @DropDownDecorator({ lookup: LookupData.ReferenceEnum(HubFileStateType) })
    HubFileState: HubFileStateType;

    @NumberDecorator({ type: NumberType.Text })
    Ver: number;

    @DateTimeDecorator({ type: DateTimeType.DateTime })
    CreatedAt: Date;

    @DateTimeDecorator({ type: DateTimeType.SignleDate })
    FilterDate: Date;

    @DateTimeDecorator({ type: DateTimeType.SignleDate })
    FilterFromDate: Date;

    @DateTimeDecorator({ type: DateTimeType.SignleDate })
    FilterToDate: Date;
}

export class HubFileFlow {
    Type: string;
    Data: string;
    Childs: HubFileFlow[];
}

@TableDecorator()
export class COARequestData {
    @DropDownDecorator({ lookup: LookupData.ReferenceItems(ConstantHelper.MAM_TYPES) })
    Mam: string;

    @DropDownDecorator({ label: 'Meter', lookup: LookupData.Reference(MeterEntity, ['MeterSerialNumber']) })
    MeterId: number;

    @DateTimeDecorator({ required: true, label: 'Start Date', type: DateTimeType.Date })
    DateTime: Date;
}

@TableDecorator()
export class ONARequestData {
    @DropDownDecorator({ label: 'Meter', lookup: LookupData.Reference(MeterEntity, ['MeterSerialNumber']) })
    MeterId: number;

    @DropDownDecorator({ lookup: LookupData.ReferenceItems(ConstantHelper.MAM_TYPES) })
    Mam: string;

    @BooleanDecorator({ lookup: LookupData.ReferenceEnum(ONAType), type: BooleanType.RadioButton })
    Type: ONAType;

    @DateTimeDecorator({ required: true, label: 'Effective From Date', type: DateTimeType.Date })
    EffectiveFromDate: Date;

    @DropDownDecorator({ lookup: LookupData.ReferenceItems(ConstantHelper.ASSET_CLASS_CODES) })
    AssetClassCode: string;

    @DropDownDecorator({ lookup: LookupData.ReferenceItems(ConstantHelper.PAYMENT_METHOD_CODES) })
    PaymentMethodCode: string;

    @StringDecorator({ max: 250 })
    ModelCode: string;

    @StringDecorator({ max: 250 })
    ManufacturerCode: string;

    @NumberDecorator({ type: NumberType.Text, min: 1900, max: 9999 })
    YearOfManufacture: number;

    @StringDecorator({ max: 14 })
    SerialNumber: string;

    @DropDownDecorator({ lookup: LookupData.ReferenceItems(ConstantHelper.LOCATION_CODES) })
    LocationCode: string;

    @DropDownDecorator({ lookup: LookupData.ReferenceItems(ConstantHelper.ASSET_STATUS_CODES) })
    AssetStatusCode: string;

    @StringDecorator({ max: 250 })
    AssetLocationNotes: string;

    @DropDownDecorator({ required: true, lookup: LookupData.ReferenceItems(ConstantHelper.METER_TYPE_CODES) })
    MeterTypeCode: string;

    @DropDownDecorator({ required: true, lookup: LookupData.ReferenceItems(ConstantHelper.METER_MECHANISM_CODES) })
    MeterMechanismCode: string;

    @NumberDecorator({ step: 0.01, decimals: 2 })
    MeasuringCapacity: number;

    @DropDownDecorator({ required: true, lookup: LookupData.ReferenceItems(ConstantHelper.REGISTER_TYPE_CODES) })
    RegisterTypeCode: string;

    @NumberDecorator({ required: true })
    NoOfDigits: number;

    @DropDownDecorator({ required: true, lookup: LookupData.ReferenceItems(ConstantHelper.UNIT_OF_MEASURES) })
    UnitsofMeasure: string;

    @DropDownDecorator({ lookup: LookupData.ReferenceItems(ConstantHelper.ROLE_CODES) })
    RoleCode: string;

    @NumberDecorator({ required: true, step: 0.001, decimals: 3, max: 999999.999 })
    MultiplicationFactor: number;
}

@TableDecorator()
export class DateRequestData {
    @DateTimeDecorator({ required: true, label: 'Supply Start Date', type: DateTimeType.Date })
    DateTime: Date;
}

@TableDecorator()
export class ONJOBRequestData {
    @DropDownDecorator({ label: 'Meter', lookup: LookupData.Reference(MeterEntity, ['MeterSerialNumber']) })
    MeterId: number;
    
    @DropDownDecorator({ required: true, lookup: LookupData.ReferenceItems(ConstantHelper.MAM_TYPES) })
    Mam: string;

    @NumberDecorator({ max: 250, type: NumberType.Text })
    Mprn: number;

    @DropDownDecorator({ required: true, lookup: LookupData.ReferenceItems(ConstantHelper.ASSET_CLASS_CODES) })
    AssetClassCode: string;

    @DropDownDecorator({ lookup: LookupData.ReferenceItems(ConstantHelper.ASSET_STATUS_CODES) })
    AssetStatusCode: string;

    @DropDownDecorator({ lookup: LookupData.ReferenceItems(ConstantHelper.PAYMENT_METHOD_CODES) })
    PaymentMethodCode: string;

    @StringDecorator({ max: 250 })
    ModelCode: string;

    @StringDecorator({ max: 250 })
    ManufacturerCode: string;

    @NumberDecorator({ type: NumberType.Text, min: 1900, max: 9999 })
    YearOfManufacture: number;

    @StringDecorator({ max: 14 })
    SerialNumber: string;

    @DropDownDecorator({ lookup: LookupData.ReferenceItems(ConstantHelper.LOCATION_CODES) })
    LocationCode: number;

    @StringDecorator({ max: 250 })
    AssetLocationNotes: string;

    @DropDownDecorator({ required: true, lookup: LookupData.ReferenceItems(ConstantHelper.METER_TYPE_CODES) })
    MeterTypeCode: string;

    @DropDownDecorator({ required: true, lookup: LookupData.ReferenceItems(ConstantHelper.METER_MECHANISM_CODES) })
    MeterMechanismCode: string;

    @NumberDecorator({ step: 0.01, decimals: 2 })
    MeasuringCapacity: number;

    @DropDownDecorator({ lookup: LookupData.ReferenceItems(ConstantHelper.ROLE_CODES) })
    RoleCode: string;

    @DropDownDecorator({ required: true, lookup: LookupData.ReferenceItems(ConstantHelper.REGISTER_TYPE_CODES) })
    RegisterTypeCode: string;

    @NumberDecorator()
    NoOfDigits: number;

    @DropDownDecorator({ required: true, lookup: LookupData.ReferenceItems(ConstantHelper.UNIT_OF_MEASURES) })
    UnitsOfMeasure: string;

    @NumberDecorator({ required: true, step: 0.001, decimals: 3, max: 999999.999 })
    MultiplicationFactor: number;

    @DateTimeDecorator({ type: DateTimeType.Date })
    ReadingDate: Date;

    @NumberDecorator()
    RoundTheClock: number;

    @NumberDecorator({ required: true })
    ReadingIndex: number;

    @BooleanDecorator({ lookup: LookupData.ReferenceEnum(MeterWorkRequestType), type: BooleanType.RadioButton })
    MeterWorkRequestType: MeterWorkRequestType;

    RemoveRequestData: ONJOBRequestData;
}

@TableDecorator()
export class U01RequestData {
    @DropDownDecorator({ required: true, lookup: LookupData.ReferenceItems(ConstantHelper.METER_READING_REASONS_SENT) })
    Type: string;

    @NumberDecorator()
    MeterReadId: number;
}

@TableDecorator()
export class C41RequestData {
    @DropDownDecorator({
        required: true, lookup: {
            items: [
                { value: 1, label: "Confirmed Theft of Gas" },
                { value: 2, label: "Change in Consumers Plant" },
                { value: 3, label: "Commencement of a new business activity" },
                { value: 4, label: "Tolerance change" },
                { value: 5, label: "Winter Consumption" }
            ]
        }
    })
    RequestReason: number;

    @NumberDecorator({ required: true, type: NumberType.Text })
    RequestedEstimated: number;

    @NumberDecorator({ required: true, type: NumberType.Text })
    RequestedWc: number;

    @DropDownDecorator({ lookup: LookupData.Reference(MeterReadEntity, ['MeterReading', 'ActualReadDate']) })
    MeterRead: number;

    @DateTimeDecorator({ required: true, type: DateTimeType.Date })
    MeterReadingDate: Date;

    @StringDecorator({ required: true, max: 14 })
    MeterSerialNumber: string;

    @StringDecorator({ required: true, max: 12 })
    MeterReading: string;

    @StringDecorator({ required: true, max: 254 })
    SupportingInformation: string;
}

@TableDecorator()
export class C42RequestData {
    @StringDecorator({ required: true, max: 255, type: StringType.MultiText })
    CancellationReason: string;
}

@TableDecorator()
export class T05RequestData {
    @DropDownDecorator({ required: true, lookup: LookupData.ReferenceItems(ConstantHelper.METER_CANCELLATION_REASON_CODES) })
    CancellationReasonCode: number;
}

@TableDecorator()
export class S40RequestData {
    @DropDownDecorator({ required: true, lookup: LookupData.ReferenceItems(ConstantHelper.REASON_CODES) })
    ReasonCode: number;
}

@TableDecorator()
export class ORJOBRequestData {
    @DropDownDecorator({ label: 'Meter', lookup: LookupData.Reference(MeterEntity, ['MeterSerialNumber']) })
    MeterId: number;

    @DropDownDecorator({ required: true, lookup: LookupData.ReferenceItems(ConstantHelper.ASSET_CLASS_CODES) })
    AssetClassCode: string;

    @StringDecorator({ max: 250 })
    ModelCode: string;

    @DropDownDecorator({ required: true, lookup: LookupData.ReferenceItems(ConstantHelper.METER_TYPE_CODES) })
    MeterTypeCode: string;

    @StringDecorator({ max: 250 })
    ManufacturerCode: string;

    @DropDownDecorator({ lookup: LookupData.ReferenceItems(ConstantHelper.PAYMENT_METHOD_CODES) })
    PaymentMethodCode: string;

    @StringDecorator({ max: 250 })
    AssetLocationNotes: string;

    @DropDownDecorator({ required: true, lookup: LookupData.ReferenceItems(ConstantHelper.METER_MECHANISM_CODES) })
    MeterMechanismCode: string;

    @DateTimeDecorator({ required: true, type: DateTimeType.Date })
    AppointmentDateTime: Date;

    @BooleanDecorator({ lookup: LookupData.ReferenceEnum(MeterWorkRequestType), type: BooleanType.RadioButton })
    WorkRequestType: MeterWorkRequestType;

    @DropDownDecorator({ lookup: LookupData.ReferenceItems(ConstantHelper.LOCATION_CODES) })
    LocationCode: string;

    RemoveRequestData: ORJOBRequestData;
}

@TableDecorator()
export class ONUPDRequestData {
    @DropDownDecorator({ label: 'Meter', lookup: LookupData.Reference(MeterEntity, ['MeterSerialNumber']) })
    MeterId: number;

    @NumberDecorator({ max: 250, type: NumberType.Text })
    Mprn: string;

    @BooleanDecorator({ lookup: LookupData.ReferenceEnum(ONUPDType), type: BooleanType.RadioButton })
    Type: ONUPDType;

    @DateTimeDecorator({ required: true, label: 'Effective From Date', type: DateTimeType.Date })
    EffectiveFromDate: Date;

    @DropDownDecorator({ lookup: LookupData.ReferenceItems(ConstantHelper.ASSET_CLASS_CODES) })
    AssetClassCode: string;

    @DropDownDecorator({ lookup: LookupData.ReferenceItems(ConstantHelper.PAYMENT_METHOD_CODES) })
    PaymentMethodCode: string;

    @StringDecorator({ max: 250 })
    ModelCode: string;

    @StringDecorator({ max: 250 })
    ManufacturerCode: string;

    @NumberDecorator({ type: NumberType.Text, min: 1900, max: 9999 })
    YearOfManufacture: number;

    @StringDecorator({ max: 14 })
    SerialNumber: string;

    @DropDownDecorator({ lookup: LookupData.ReferenceItems(ConstantHelper.LOCATION_CODES) })
    LocationCode: string;

    @DropDownDecorator({ lookup: LookupData.ReferenceItems(ConstantHelper.ASSET_STATUS_CODES) })
    AssetStatusCode: string;

    @StringDecorator({ max: 250 })
    AssetLocationNotes: string;

    @DropDownDecorator({ required: true, lookup: LookupData.ReferenceItems(ConstantHelper.METER_TYPE_CODES) })
    MeterTypeCode: string;

    @DropDownDecorator({ required: true, lookup: LookupData.ReferenceItems(ConstantHelper.METER_MECHANISM_CODES) })
    MeterMechanismCode: string;

    @NumberDecorator({ step: 0.01, decimals: 2 })
    MeasuringCapacity: number;

    @DropDownDecorator({ required: true, lookup: LookupData.ReferenceItems(ConstantHelper.REGISTER_TYPE_CODES) })
    RegisterTypeCode: string;

    @NumberDecorator({ required: true })
    NoOfDigits: number;

    @DropDownDecorator({ required: true, lookup: LookupData.ReferenceItems(ConstantHelper.UNIT_OF_MEASURES) })
    UnitsofMeasure: string;

    @DropDownDecorator({ lookup: LookupData.ReferenceItems(ConstantHelper.ROLE_CODES) })
    RoleCode: string;

    @NumberDecorator({ required: true, step: 0.001, decimals: 3, max: 999999.999 })
    MultiplicationFactor: number;

    @DateTimeDecorator({ type: DateTimeType.Date })
    ReadingDate: Date;

    @NumberDecorator()
    RoundTheClock: number;

    @NumberDecorator({ required: true })
    ReadingIndex: number;
}

@TableDecorator()
export class ONADeAppRequestData {
    @DropDownDecorator({ lookup: LookupData.ReferenceItems(ConstantHelper.MAM_TYPES) })
    Mam: string;

    @BooleanDecorator({ lookup: LookupData.ReferenceEnum(ONADeAppType), type: BooleanType.RadioButton })
    Type: ONADeAppType;

    @DateTimeDecorator({ required: true, label: 'Effective From Date', type: DateTimeType.Date })
    EffectiveFromDate: Date;
}

@TableDecorator()
export class PO3RequestData {
    @StringDecorator({ max: 35 })
    ClientsContractualCustomerName: string;

    @StringDecorator({ max: 100, required: true })
    AccessInstructions: string;

    @StringDecorator({ max: 4, required: true })
    CyclicReadService: string;

    @NumberDecorator({ max: 9, type: NumberType.Text })
    ServiceLevel: number;

    @DateTimeDecorator({ type: DateTimeType.Date })
    CyclicReadServiceStartDate: Date;

    @StringDecorator({ max: 14, required: true })
    ConverterSerialNumber: string;

    @NumberDecorator({ type: NumberType.Text })
    MeterPointCorrectionFactor: number;

    @NumberDecorator({ type: NumberType.Text })
    ConverterCorrectionFactor: number;

    @NumberDecorator({ max: 99, type: NumberType.Text })
    NumberOfCorrectedDials: number;

    @NumberDecorator({ max: 9999, type: NumberType.Text })
    ConverterReadingUnit: number;

    @StringDecorator({ max: 10, required: true })
    ConverterModelName: string;

    @StringDecorator({ max: 30 })
    ConverterManufacturerName: string;

    @NumberDecorator({ max: 999, type: NumberType.Text })
    ConverterManufactureYear: number;

    @StringDecorator({ max: 14, required: true })
    MeterSerialNumber: string;

    @NumberDecorator({ max: 99, type: NumberType.Text })
    NumberOfDialsOrDigits: number;

    @StringDecorator({ max: 1, required: true })
    MeterCollarFittedIndicator: string;

    @StringDecorator({ max: 1, required: true })
    ImperialMeterIndicator: string;

    @NumberDecorator({ max: 9999, type: NumberType.Text })
    MeterReadingUnit: number;

    @StringDecorator({ max: 30, required: true })
    MeterManufacturerName: string;

    @StringDecorator({ max: 10, required: true })
    MeterModelName: string;

    @StringDecorator({ max: 1, required: true })
    BypassFittedIndicator: string;

    @StringDecorator({ max: 3 })
    MeterMechanism: string;

    @NumberDecorator({ max: 9999, type: NumberType.Text })
    MeterManufacturerYear: number;

    @NumberDecorator({ max: 99, type: NumberType.Text })
    MeterLocationCode: number;

    @StringDecorator({ max: 40 })
    MeterLocationDescription: string;

    @NumberDecorator({ type: NumberType.Text })
    MeterPointAq: number;

    @StringDecorator({ max: 10 })
    BuildingNumber: string;

    @StringDecorator({ max: 50 })
    BuildingName: string;

    @StringDecorator({ max: 30 })
    SubBuildingName: string;

    @StringDecorator({ max: 35 })
    PrincipalStreet: string;

    @StringDecorator({ max: 35 })
    DependantStreet: string;

    @StringDecorator({ max: 35 })
    DoubleDependantLocality: string;

    @StringDecorator({ max: 35 })
    DependantLocality: string;

    @StringDecorator({ max: 35 })
    PostTown: string;

    @StringDecorator({ max: 35 })
    County: string;

    @StringDecorator({ max: 4, required: true })
    PostcodeOutcode: string;

    @StringDecorator({ max: 4, required: true })
    PostcodeIncode: string;

    @StringDecorator({ max: 35, required: true })
    PremisesCustomerName: string;

    @StringDecorator({ max: 40 })
    ContactPassword: string;

    @StringDecorator({ max: 40 })
    ContactGeneralSpecialNeedsNotes: string;

    @StringDecorator({ max: 2 })
    ConditionType: string;
}

@TableDecorator()
export class UploadHubFileData {
    @FileDecorator({ label: 'Choice Files', required: true, multiple: true, url: 'Upload/UploadFile' })
    Files: string[];
}