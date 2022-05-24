import { BooleanDecorator } from "../../decorators/boolean.decorator";
import { DateTimeDecorator } from "../../decorators/datetime.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";
import { NumberDecorator } from "../../decorators/number.decorator";
import { TableDecorator } from "../../decorators/table.decorator";
import { LookupData } from "../data/lookup.data";
import { TableData } from "../data/table.data";
import { DateTimeType } from "../enums/data.type";
import { ExportType } from "../enums/export.type";
import { PdfPageSizeType } from "../enums/pdf.page.site.type";

@TableDecorator()
export class ExportDataDto {
    @DateTimeDecorator({ required: true, type: DateTimeType.DateRange })
    DateRange: Date[];

    @NumberDecorator({ required: true, min: 1, max: 10000 })
    Limit?: number;

    @DropDownDecorator({ lookup: LookupData.ReferenceEnum(ExportType) })
    Type: ExportType;

    @BooleanDecorator()
    Landscape: boolean;

    @DropDownDecorator({ lookup: LookupData.ReferenceEnum(PdfPageSizeType) })
    PageSize: PdfPageSizeType;
    
    Data: TableData;
    Reference?: new () => {};
}