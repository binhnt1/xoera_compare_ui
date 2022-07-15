import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { DispatchInvoiceDetailEntity } from '../../../../_core/domains/entities/dispatch.invoice.entity';

@Component({
    templateUrl: './edit.dispatch.invoice.detail.component.html',
    styleUrls: [
        './edit.dispatch.invoice.detail.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditDispatchInvoiceDetailComponent extends EditComponent implements OnInit {
    id: number;
    popup: boolean;
    viewer: boolean;
    invoiceId: number;
    @Input() params: any;
    loading: boolean = true;
    service: AdminApiService;
    item: DispatchInvoiceDetailEntity = new DispatchInvoiceDetailEntity();

    constructor() {
        super();
        this.service = AppInjector.get(AdminApiService);
        this.state = this.getUrlState();
    }

    async ngOnInit() {
        this.id = this.params && this.params['id'];
        this.popup = this.params && this.params['popup'];
        this.viewer = this.params && this.params['viewer'];
        this.invoiceId = this.params && this.params['invoiceId'];
        if (!this.popup) {
            if (this.state) {
                this.id = this.state.id;
                this.viewer = this.state.viewer;
                this.addBreadcrumb(this.id ? 'Edit' : 'Add');
            }
        }
        await this.loadItem();
        this.loading = false;
    }

    private async loadItem() {
        if (this.id) {
            await this.service.item('dispatchinvoicedetail', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(DispatchInvoiceDetailEntity, result.Object as DispatchInvoiceDetailEntity);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        } else {
            this.item = EntityHelper.createEntity(DispatchInvoiceDetailEntity, new DispatchInvoiceDetailEntity());
            this.item.DispatchInvoiceId = this.invoiceId;
        }
    }
    public async confirm(complete: () => void): Promise<boolean> {
        if (this.item) {
            let columns = ['Period', 'Amount', 'PaidUnpaid'];
            if (await validation(this.item, columns)) {
                this.processing = true;
                let obj: DispatchInvoiceDetailEntity = _.cloneDeep(this.item);

                // save
                if (!obj.DispatchInvoiceId)
                    obj.DispatchInvoiceId = this.invoiceId;
                return await this.service.save('dispatchinvoicedetail', obj).then((result: ResultApi) => {
                    this.processing = false;
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Save invoice detail success');
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