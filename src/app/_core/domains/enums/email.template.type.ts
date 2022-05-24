export enum EmailTemplateType {
    Register = 1,
    UserResetPassword,
    AdminResetPassword,
    RegisterCompanyAccept = 100,
    RegisterCompanyReject,
    RegisterCompanyConfirm,
    RegisterCompanyInvite,
    SendOtp = 200,
}
export function EmailTemplateTypeAware(constructor: Function) {
    constructor.prototype.EmailTemplateType = EmailTemplateType;
}