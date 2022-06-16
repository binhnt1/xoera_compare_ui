import { BaseEntity } from "./base.entity";
import { LookupData } from "../data/lookup.data";
import { CompanyEntity } from "./company.entity";
import { DateTimeType } from "../enums/data.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { BooleanDecorator } from "../../decorators/boolean.decorator";
import { DateTimeDecorator } from "../../decorators/datetime.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";

@TableDecorator({ title: 'CompanyPartner' })
export class CompanyPartnerEntity extends BaseEntity {

    @DropDownDecorator({ lookup: LookupData.Reference(CompanyEntity) })
    CompanyId: number;

    @DropDownDecorator({ lookup: LookupData.Reference(CompanyEntity) })
    PartnerId: number;

    @BooleanDecorator()
    Accept: boolean;

    @DateTimeDecorator({ type: DateTimeType.DateTime })
    AcceptOn: Date;
}