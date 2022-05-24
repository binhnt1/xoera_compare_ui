export enum SmsTemplateType {
    Register = 1,
    ResetPassword,
    RegisterBussinessAccount = 100,
}
export function SmsTemplateTypeAware(constructor: Function) {
    constructor.prototype.SmsTemplateType = SmsTemplateType;
}