export enum PatternType {
    Min = 'min', 
    Max = 'max',
    CardCvc = 'cvc',
    Unique = 'unique',
    CardNumber = 'card',
    Required = 'required',
    RequiredMatch = 'match'
}
export function PatternTypeAware(constructor: Function) {
    constructor.prototype.PatternType = PatternType;
}
