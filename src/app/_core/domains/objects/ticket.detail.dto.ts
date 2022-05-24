import { UserEntity } from "../entities/user.entity";
import { TicketDetailEntity } from "../entities/ticket.detail.entity";

export class TicketDetailDto extends TicketDetailEntity {
    public AnswerBy?: UserEntity;
    public AssignTo?: UserEntity;
    public QuestionBy?: UserEntity;
    public QuoteAnswerBy?: UserEntity;
    public QuoteQuestionBy?: UserEntity;
}