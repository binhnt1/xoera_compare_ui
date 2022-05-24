import { BaseEntity } from "./base.entity";
import { AgencyEntity } from "./broker.entity";
import { StringType } from "../enums/data.type";
import { LookupData } from "../data/lookup.data";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { BooleanDecorator } from "../../decorators/boolean.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";

@TableDecorator()
export class SecurityRightEntity extends BaseEntity {
    @StringDecorator({ type: StringType.Text, max: 100 })
    Group: string;

    @StringDecorator({ type: StringType.Text, max: 200 })
    Name: string;

    @StringDecorator({ type: StringType.Text, max: 200 })
    Label: string;

    @BooleanDecorator()
    Value: boolean;

    @DropDownDecorator({ label: 'Broker', lookup: LookupData.Reference(AgencyEntity, ['AgencyName']) })
    AgencyId: number;
}