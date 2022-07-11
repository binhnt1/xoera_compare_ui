import { TableDecorator } from "../../decorators/table.decorator";
import { NumberDecorator } from "../../decorators/number.decorator";

TableDecorator()
export class SummaryExchangeDto {
    @NumberDecorator()
    Partners: number;

    @NumberDecorator()
    PublishedJobs: number;

    @NumberDecorator()
    AvaiableJobs: number;

    @NumberDecorator()
    CompletedJobs: number;

    @NumberDecorator()
    AcceptedJobs: number;

    @NumberDecorator()
    PaymentPending: number;
}