import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { ListImportFixedPriceComponent } from './list.import.fixed.price.component';
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
    @ViewChild('fixedPriceComponent') fixedPriceComponent: ListImportFixedPriceComponent;
    
    constructor() {
        super();
        this.service = AppInjector.get(AdminApiService);
    }

    async ngOnInit() {
        this.items = this.params && this.params['items'];
    }

    updateGrid() {
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            item.Drop = this.item.Drop;
            item.Return = this.item.Return;
            item.IsActive = this.item.IsActive;
            item.TariffId = this.item.TariffId;
            item.VehTypeId = this.item.VehTypeId;
            item.ReverseDirection = this.item.ReverseDirection;
        }
        this.fixedPriceComponent.renderItems(this.items);
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