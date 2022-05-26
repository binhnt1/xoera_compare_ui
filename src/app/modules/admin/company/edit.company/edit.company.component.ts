import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { CompanyEntity } from '../../../../_core/domains/entities/company.entity';
import { EditComponent } from '../../../../_core/components/edit/edit.component';

@Component({
    templateUrl: './edit.company.component.html',
    styleUrls: [
        './edit.company.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditCompanyComponent extends EditComponent implements OnInit {
    id: number;
    popup: boolean;
    viewer: boolean;
    @Input() params: any;
    tab: string = 'content';
    loading: boolean = true;
    service: AdminApiService;
    loadingTemplate: boolean = false;
    item: CompanyEntity = new CompanyEntity();

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
        this.item = new CompanyEntity();
        if (this.id) {
            await this.service.item('company', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(CompanyEntity, result.Object as CompanyEntity);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
    }
    public async confirm(complete: () => void): Promise<boolean> {
        if (this.item) {
            let columns = this.authen.management 
                ? ['Name', 'AccountId']
                : ['Name']
            if (await validation(this.item, columns)) {
                this.processing = true;
                let obj: CompanyEntity = _.cloneDeep(this.item);
                
                // accountId
                if (!obj.AccountId) obj.AccountId = this.authen.account.Id;

                // save
                return await this.service.save('company', obj).then((result: ResultApi) => {
                    this.processing = false;
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Save company success');
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