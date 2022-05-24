export enum MethodType {
    Get = 1,
    Put,
    Post,
    Delete,
}
export function MethodTypeAware(constructor: Function) {
    constructor.prototype.MethodType = MethodType;
}
