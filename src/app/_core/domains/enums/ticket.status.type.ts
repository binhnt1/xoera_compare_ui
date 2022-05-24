export enum TicketStatusType {
    Open = 1,
    Assigned,
    Closed,
    ReOpened
    
}
export function TicketStatusTypeAware(constructor: Function) {
    constructor.prototype.TicketStatusType = TicketStatusType;
}
