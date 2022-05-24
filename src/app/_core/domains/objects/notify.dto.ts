import { NotifyType } from "../enums/notify.type";

export class NotifyDto {
    Title: string;
    UserId: number;
    IsRead: string;
    DateTime: Date;
    Content: string;
    Type: NotifyType;
    RelativeTime: string;
}