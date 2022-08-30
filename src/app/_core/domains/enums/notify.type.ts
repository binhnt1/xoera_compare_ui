export enum NotifyType {
    Message = 1,
    Logout,
    LockUser = 10,
    UpdateRole,
    ChangePassword,
    Answer,
    JobPublished,
    JobAccepted,
    JobBidding,
    JobExpried
}
export function NotifyTypeAware(constructor: Function) {
    constructor.prototype.NotifyType = NotifyType;
}
