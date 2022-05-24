export enum NotifyType {
    Message = 1,
    LockUser = 10,
    UpdateRole,
    ChangePassword
}
export function NotifyTypeAware(constructor: Function) {
    constructor.prototype.NotifyType = NotifyType;
}
