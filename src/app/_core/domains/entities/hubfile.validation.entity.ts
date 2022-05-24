import { BaseEntity } from './base.entity';
import { LookupData } from '../data/lookup.data';
import { NumberType, StringType } from '../enums/data.type';
import { FlowDirectionType } from '../enums/flow.direction.type';
import { TableDecorator } from '../../decorators/table.decorator';
import { FlowType, MultipleAllowedType } from '../enums/flow.type';
import { StringDecorator } from '../../decorators/string.decorator';
import { NumberDecorator } from '../../decorators/number.decorator';
import { DropDownDecorator } from '../../decorators/dropdown.decorator';

@TableDecorator()
export class HubFileValidationEntity extends BaseEntity {
    @NumberDecorator({ type: NumberType.Text })
    NodeId: string;

    @StringDecorator({ max: 40 })
    Flow: string;

    @StringDecorator({ max: 40 })
    FlowType: string;
    
    @DropDownDecorator({ lookup: LookupData.ReferenceEnum(FlowType) })
    Type: FlowType;

    @StringDecorator({ max: 250 })
    Condition: string;

    @StringDecorator({ max: 250 })
    ParentNode: string;

    @StringDecorator({ max: 2000, type: StringType.MultiText, rows: 8 })
    StatusItems: string;

    @StringDecorator({ max: 250 })
    AutoNextNode: string;

    @StringDecorator({ max: 250 })
    RestrictedNode: string;

    @StringDecorator({ max: 250 })
    CancellationNode: string;

    @StringDecorator({ max: 250 })
    PositiveResponse: string;

    @StringDecorator({ max: 250 })
    NegativeResponse: string;
    
    @DropDownDecorator({ lookup: LookupData.ReferenceEnum(FlowDirectionType) })
    Direction: FlowDirectionType;
    
    @DropDownDecorator({ lookup: LookupData.ReferenceEnum(MultipleAllowedType) })
    MultipleAllowed: MultipleAllowedType;
}