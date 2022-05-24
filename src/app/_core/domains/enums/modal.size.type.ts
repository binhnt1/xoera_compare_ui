export enum ModalSizeType {
    Small = 1,
    Large,
    Medium,
    Default,
    ExtraLarge,
    FullScreen,
}
export function ModalSizeTypeAware(constructor: Function) {
    constructor.prototype.ModalSizeType = ModalSizeType;
}
