import { BaseEntity } from './base.entity';
import { TableDecorator } from '../../decorators/table.decorator';
import { StringDecorator } from '../../decorators/string.decorator';

@TableDecorator()
export class MprnEntity extends BaseEntity {
    @StringDecorator({ max: 50 })
    Mprn1: string;

    @StringDecorator({ max: 250 })
    Column9: string;

    @StringDecorator({ max: 250 })
    Column10: string;

    @StringDecorator({ max: 250 })
    Column11: string;

    @StringDecorator({ max: 250 })
    Column14: string;

    @StringDecorator({ max: 250 })
    Outcode: string;

    @StringDecorator({ max: 250 })
    Incode: string;
}