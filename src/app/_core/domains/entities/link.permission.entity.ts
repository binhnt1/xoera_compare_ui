import { BaseEntity } from './base.entity';
import { LookupData } from '../data/lookup.data';
import { NumberType, StringType } from '../enums/data.type';
import { ConstantHelper } from '../../helpers/constant.helper';
import { TableDecorator } from '../../decorators/table.decorator';
import { StringDecorator } from '../../decorators/string.decorator';
import { NumberDecorator } from '../../decorators/number.decorator';
import { DropDownDecorator } from '../../decorators/dropdown.decorator';

@TableDecorator()
export class LinkPermissionEntity extends BaseEntity {
    @StringDecorator({ required: true, allowSearch: true, type: StringType.Text, max: 150 })
    Name: string;

    @DropDownDecorator({ required: true, allowSearch: true, lookup: LookupData.ReferenceStrings(ConstantHelper.LINKS) })
    Link: string;

    @DropDownDecorator({ lookup: LookupData.ReferenceStrings(ConstantHelper.LA_ICONS) })
    CssIcon: string;

    @NumberDecorator({ type: NumberType.Numberic })
    Order: number;

    @DropDownDecorator({ lookup: LookupData.Reference(LinkPermissionEntity) })
    ParentId: number;

    @DropDownDecorator({ allowSearch: true, lookup: LookupData.ReferenceStrings(ConstantHelper.PERMISSIONS) })
    PermissionName: string;

    @StringDecorator({ type: StringType.Text, max: 150 })
    Group: string;

    @NumberDecorator({ type: NumberType.Numberic })
    GroupOrder: number;
}