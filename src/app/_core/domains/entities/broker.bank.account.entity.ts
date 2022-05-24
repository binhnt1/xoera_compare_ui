import { BaseEntity } from "./base.entity";
import { AgencyEntity } from "./broker.entity";
import { LookupData } from "../data/lookup.data";
import { StringType } from "../enums/data.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";

@TableDecorator({ title: 'Broker Bank Account' })
export class AgencyBankAccountEntity extends BaseEntity {
    @StringDecorator({ type: StringType.Text, max: 250 })
    BankName: string;

    @StringDecorator({ type: StringType.Text, max: 250 })
    AccountName: string;

    @StringDecorator({ type: StringType.Code, max: 250 })
    SortCode: string;
    
    @StringDecorator({ type: StringType.Text, max: 250 })
    AccountNumber: string;

    @DropDownDecorator({ label: 'Broker', lookup: LookupData.Reference(AgencyEntity, ['AgencyName']) })
    AgencyId: number;
}