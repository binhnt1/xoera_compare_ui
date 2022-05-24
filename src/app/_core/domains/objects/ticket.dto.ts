import { UserEntity } from "../entities/user.entity";
import { TicketEntity } from "../entities/ticket.entity";
import { TicketCategoryEntity } from "../entities/ticket.category.entity";

export class TicketDto extends TicketEntity {
    public Count?: number;
    public User?: UserEntity;
    public AssignTo?: UserEntity;
    public Category?: TicketCategoryEntity;
}