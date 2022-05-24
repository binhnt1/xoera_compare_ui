export enum FeedbackType {
    Sales = 1,
    Feedback,
    Technical,
}
export function FeedbackTypeAware(constructor: Function) {
    constructor.prototype.FeedbackType = FeedbackType;
}
