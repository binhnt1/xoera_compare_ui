import { BaseEntity } from "./base.entity";
import { CompanyEntity } from "./company.entity";
import { LookupData } from "../data/lookup.data";
import { JobStatusType } from "../enums/job.status.type";
import { VehicleTypeEntity } from "./vehicle.type.entity";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { NumberDecorator } from "../../decorators/number.decorator";
import { BooleanDecorator } from "../../decorators/boolean.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";
import { DateTimeDecorator } from "../../decorators/datetime.decorator";
import { DateTimeType, NumberType, StringType } from "../enums/data.type";

@TableDecorator({ title: 'Job' })
export class JobEntity extends BaseEntity {

    @NumberDecorator({ max: 100000, type: NumberType.Text })
    LeadTime: number;

    @StringDecorator({ type: StringType.MultiText, max: 500 })
    Notes: string;

    @NumberDecorator({ max: 10, type: NumberType.Text })
    Luggages: number;

    @NumberDecorator({ max: 100000, step: 1, decimals: 2, type: NumberType.Text })
    Price: number;

    @StringDecorator({ type: StringType.Text, max: 20 })
    OutCode: string;

    @DropDownDecorator({ lookup: LookupData.Reference(CompanyEntity, ['Name']) })
    CompanyId: number;

    @NumberDecorator({ max: 100000, type: NumberType.Text })
    SourceType: number;

    @NumberDecorator({ max: 10, type: NumberType.Text })
    Passengers: number;

    @StringDecorator({ type: StringType.Text, max: 45 })
    ZoneName: string;

    @StringDecorator({ type: StringType.Text, max: 20 })
    BookerRef: string;

    @StringDecorator({ type: StringType.Text, max: 250 })
    Passenger: string;    

    @NumberDecorator({ max: 100000, step: 1, decimals: 2, type: NumberType.Text })
    Parking: number;

    @NumberDecorator({ type: NumberType.Text, decimals: 8 })
    PKGeoLat: number;

    @NumberDecorator({ type: NumberType.Text, decimals: 8 })
    PKGeoLng: number;   

    @NumberDecorator({ max: 100000, step: 1, decimals: 2, type: NumberType.Text })
    Distance: number;

    @StringDecorator({ type: StringType.Text, max: 20 })
    RtnOutCode: string;

    @StringDecorator({ type: StringType.Text, max: 250 })
    PickupType: string;

    @DropDownDecorator({ lookup: LookupData.Reference(VehicleTypeEntity, ['TypeName']) })
    VehicleTypeId: number;

    @StringDecorator({ type: StringType.Text, max: 250 })
    SmsDispatch: string;

    @StringDecorator({ type: StringType.Text, max: 250 })
    DropoffType: string;

    @BooleanDecorator()
    MeetAndGreet: boolean;

    @NumberDecorator({ type: NumberType.Text, decimals: 8 })
    DoffGeoLat: number;

    @NumberDecorator({ type: NumberType.Text, decimals: 8 })
    DoffGeoLng: number;   

    @NumberDecorator({ max: 100000, step: 1, decimals: 2, type: NumberType.Text })
    CashAmount: number;

    @NumberDecorator({ max: 100000, step: 1, decimals: 2, type: NumberType.Text })
    CardAmount: number;

    @NumberDecorator({ max: 100000, step: 1, decimals: 2, type: NumberType.Text })
    SystemFare: number;

    @StringDecorator({ type: StringType.Text, max: 150 })
    FlightNumber: string;

    @NumberDecorator({ max: 100000, type: NumberType.Text })
    WaitingTime: number;

    @StringDecorator({ type: StringType.Text, max: 250 })
    PickupAddress: string;

    @DateTimeDecorator({ type: DateTimeType.DateTime })
    AcceptedAt: Date;

    @DropDownDecorator({ lookup: LookupData.ReferenceEnum(JobStatusType) })
    Status: JobStatusType;

    @StringDecorator({ type: StringType.Email, max: 250 })
    PassengerEmail: string;

    @StringDecorator({ type: StringType.PhoneText, min: 10, max: 10 })
    PassengerPhone: string;

    @StringDecorator({ type: StringType.MultiText, max: 500 })
    NotesForDriver: string;

    @StringDecorator({ type: StringType.Text, max: 250 })
    DropoffAddress: string;

    @NumberDecorator({ max: 100000, step: 1, decimals: 2, type: NumberType.Text })
    OthersAmount: number;

    @StringDecorator({ type: StringType.Text, max: 20 })
    PickupPostcode: string;

    @StringDecorator({ type: StringType.Text, max: 250 })
    DropoffPostcode: string;

    @NumberDecorator({ max: 100000, step: 1, decimals: 2, type: NumberType.Text })
    PriceBidding: number;

    @StringDecorator({ type: StringType.Text, max: 250 })
    VehicleTypeName: string;

    @NumberDecorator({ max: 100000, step: 1, decimals: 2, type: NumberType.Text })
    VoucherAmount: number;

    @DateTimeDecorator({ type: DateTimeType.DateTime })
    BookingDateTime: Date;

    @StringDecorator({ type: StringType.Text, max: 10 })
    PassengerPhoneCode: string;

    @StringDecorator({ type: StringType.MultiText, max: 500 })
    MeetAndGreetMessage: string;
}