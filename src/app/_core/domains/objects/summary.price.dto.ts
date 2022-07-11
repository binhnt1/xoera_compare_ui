import { TableDecorator } from "../../decorators/table.decorator";
import { NumberDecorator } from "../../decorators/number.decorator";

TableDecorator()
export class SummaryPriceDto {
    @NumberDecorator()
    Price: number;

    @NumberDecorator()
    Tariff: number;

    @NumberDecorator()
    PriceHike: number;

    @NumberDecorator()
    PriceRule: number;

    @NumberDecorator()
    FixedPrice: number;
}