export enum TicketPriorityType {
    Low = 1,
    Normal,
    Hight,
}
export function TicketPriorityTypeAware(constructor: Function) {
    constructor.prototype.TicketPriorityType = TicketPriorityType;
}
