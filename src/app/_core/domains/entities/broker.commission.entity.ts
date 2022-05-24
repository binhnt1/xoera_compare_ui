import { BaseEntity } from "./base.entity";
import { AgencyEntity } from "./broker.entity";
import { LookupData } from "../data/lookup.data";
import { SupplierEntity } from "./supplier.entity";
import { DateTimeType, NumberType } from "../enums/data.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { NumberDecorator } from "../../decorators/number.decorator";
import { DateTimeDecorator } from "../../decorators/datetime.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";

@TableDecorator({ title: 'Broker Commission' })
export class AgencyCommissionEntity extends BaseEntity {
    @NumberDecorator({ step: 0.01, type: NumberType.Text })
    GasRate: string;

    @NumberDecorator({ step: 0.01, type: NumberType.Text })
    ElectricityRate: string;

    @DateTimeDecorator({ type: DateTimeType.Date })
    ValidFrom: Date;

    @DateTimeDecorator({ type: DateTimeType.Date })
    ValidUntil: Date;

    @DropDownDecorator({ label: 'Broker', lookup: LookupData.Reference(AgencyEntity, ['AgencyName']) })
    AgencyId: number;

    @DropDownDecorator({ label: 'Supplier', lookup: LookupData.Reference(SupplierEntity, ['Abbreviation']) })
    SupplierId: number;
}