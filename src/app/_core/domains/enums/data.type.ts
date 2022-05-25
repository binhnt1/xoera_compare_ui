export enum DataType {
    String = 1,
    File,
    Image,
    Number,
    Boolean,
    DateTime,
    DropDown,
}
export function DataTypeAware(constructor: Function) {
    constructor.prototype.DataType = DataType;
}

export enum StoreType {
    Local = 1,
    Cloud,
    Database
}
export function StoreTypeAware(constructor: Function) {
    constructor.prototype.StoreType = StoreType;
}

export enum NumberType {
    Text = 1,
    Range,
    Numberic
}
export function NumberTypeAware(constructor: Function) {
    constructor.prototype.NumberType = NumberType;
}

export enum BooleanType {
    RadioButton = 1,
    Checkbox
}
export function BooleanTypeAware(constructor: Function) {
    constructor.prototype.BooleanType = BooleanType;
}

export enum DateTimeType {
    Date = 1,
    Time,
    DateTime,
    DateRange,
    DateMonth,
    SignleDate,
}
export function DateTimeTypeAware(constructor: Function) {
    constructor.prototype.DateTimeType = DateTimeType;
}

export enum StringType {
    Cvc = 1,
    Otp,
    Tag,
    Text,
    Code,
    Link,
    Card,
    Html,
    Json,
    Phone,
    Email,
    Skype,
    Search,
    Account,
    Address,
    Password,
    MultiText,
    PhoneText,
    LinkYoutube,
    AutoGenerate
}
export function StringTypeAware(constructor: Function) {
    constructor.prototype.StringType = StringType;
}

export enum DropdownLoadType {
    All = 1,
    Ajax
}
export function DropdownLoadTypeAware(constructor: Function) {
    constructor.prototype.DropdownLoadType = DropdownLoadType;
}