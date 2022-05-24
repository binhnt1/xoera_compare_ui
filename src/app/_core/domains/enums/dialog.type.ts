export enum DialogType {
    Alert,
    Dialog,
    Confirm,
    Loading,
    Wrapper,
    Timeout,
    AdminEdit,
    AdminView,
    AlertTimer,
    ChangePassword,
}
export function DialogTypeAware(constructor: Function) {
    constructor.prototype.DialogType = DialogType;
}