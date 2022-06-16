import * as _ from 'lodash';
import { LookupData } from '../data/lookup.data';
import { CompanyEntity } from '../entities/company.entity';
import { TableDecorator } from '../../decorators/table.decorator';
import { DropDownDecorator } from '../../decorators/dropdown.decorator';

@TableDecorator({ name: 'CompanyPartnerDto' })
export class CompanyPartnerDto {    
    @DropDownDecorator({ lookup: LookupData.Reference(CompanyEntity) })
    CompanyId: number;

    @DropDownDecorator({ lookup: LookupData.Reference(CompanyEntity), multiple: true })
    PartnerIds: number[];
}
