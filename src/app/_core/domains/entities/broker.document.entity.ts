import { BaseEntity } from "./base.entity";
import { AgencyEntity } from "./broker.entity";
import { LookupData } from "../data/lookup.data";
import { FileDecorator } from "../../decorators/file.decorator";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { NumberDecorator } from "../../decorators/number.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";
import { DateTimeDecorator } from "../../decorators/datetime.decorator";
import { DateTimeType, StoreType, StringType } from "../enums/data.type";

@TableDecorator({ title: 'Broker Document' })
export class AgencyDocumentEntity extends BaseEntity {
    @StringDecorator({ required: true, type: StringType.Text, max: 250 })
    DocumentName: string;

    @StringDecorator({ type: StringType.Text, max: 250 })
    DiskFilePath: string;
    
    @StringDecorator({ type: StringType.Text, max: 250 })
    FileName: string;
    
    @StringDecorator({ type: StringType.Text, max: 250 })
    FileType: string;
    
    @StringDecorator({ type: StringType.Text, max: 20 })
    FileExt: string;

    @NumberDecorator({ step: 0.01 })
    FileSize: number;

    @DateTimeDecorator({ type: DateTimeType.DateTime })
    FileLastModifiedAt: Date;

    @FileDecorator({ label: 'Document', store: StoreType.Database })
    DocumentBase64: string;

    @DropDownDecorator({ label: 'Broker', lookup: LookupData.Reference(AgencyEntity, ['AgencyName']) })
    AgencyId: number;

    Document: any;
}