import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { DispatchInvoiceEntity } from '../../../../_core/domains/entities/dispatch.invoice.entity';

@Component({
    templateUrl: './edit.dispatch.invoice.component.html',
    styleUrls: [
        './edit.dispatch.invoice.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditDispatchInvoiceComponent extends EditComponent implements OnInit {
    id: number;
    popup: boolean;
    viewer: boolean;
    @Input() params: any;
    tab: string = 'content';
    loading: boolean = true;
    service: AdminApiService;
    loadingTemplate: boolean = false;
    item: DispatchInvoiceEntity = new DispatchInvoiceEntity();

    constructor() {
        super();
        this.service = AppInjector.get(AdminApiService);
        this.state = this.getUrlState();
    }

    async ngOnInit() {
        this.id = this.params && this.params['id'];
        this.popup = this.params && this.params['popup'];
        this.viewer = this.params && this.params['viewer'];
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

    selectedTab(tab: string) {
        this.tab = tab;
    }

    private async loadItem() {
        this.item = new DispatchInvoiceEntity();
        if (this.id) {
            await this.service.item('dispatchinvoice', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(DispatchInvoiceEntity, result.Object as DispatchInvoiceEntity);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
    }
    public async confirm(complete: () => void): Promise<boolean> {
        if (this.item) {
            let columns = this.authen.management 
                ? ['Period', 'IssueDate', 'Amount', 'PaidUnpaid', 'AccountId']
                : ['Period', 'IssueDate', 'Amount', 'PaidUnpaid']
            if (await validation(this.item, columns)) {
                this.processing = true;
                let obj: DispatchInvoiceEntity = _.cloneDeep(this.item);
                
                // accountId
                if (!obj.AccountId) obj.AccountId = this.authen.account.Id;

                // save
                return await this.service.save('dispatchinvoice', obj).then((result: ResultApi) => {
                    this.processing = false;
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Save invoice success');
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