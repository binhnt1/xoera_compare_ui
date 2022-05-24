export enum AlignType {
    Left = 1,
    Right,
    Center,
}
export function AlignTypeAware(constructor: Function) {
    constructor.prototype.AlignType = AlignType;
}
