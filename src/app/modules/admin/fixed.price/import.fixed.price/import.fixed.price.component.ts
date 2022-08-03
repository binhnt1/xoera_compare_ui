import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { FixedPriceEntity } from '../../../../_core/domains/entities/fixed.price.entity';

@Component({
    templateUrl: './import.fixed.price.component.html',
    styleUrls: [
        './import.fixed.price.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class ImportFixedPriceComponent extends EditComponent implements OnInit {
    @Input() params: any;
    service: AdminApiService;
    items: FixedPriceEntity[];
    item: FixedPriceEntity = new FixedPriceEntity();
    
    constructor() {
        super();
        this.service = AppInjector.get(AdminApiService);
    }

    async ngOnInit() {
        this.items = this.params && this.params['items'];
    }

    public async confirm(complete: () => void): Promise<boolean> {
        if (this.item) {
            let columns = this.authen.management 
                ? ['Price', 'TariffId', 'VehTypeId', 'AccountId']
                : ['Price', 'TariffId', 'VehTypeId']
            if (await validation(this.item, columns)) {
                this.processing = true;
                let obj: FixedPriceEntity = _.cloneDeep(this.item);
                
                // accountId
                if (!obj.AccountId) obj.AccountId = this.authen.account.Id;

                // save
                return await this.service.save('fixedprice', obj).then((result: ResultApi) => {
                    this.processing = false;
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Save fixed price success');
                        if (complete) complete();
                        return true;
                    } else {
                        ToastrHelper.ErrorResult(result);
                        return false;
                    }
                }, () => {
                    this.processing = false;
                    return false;
                });
            }
        }
        return false;
    }
}