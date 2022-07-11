import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { MethodType } from '../../../../_core/domains/enums/method.type';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { CompanyPartnerLiteDto } from '../../../../_core/domains/objects/company.partner.dto';
import { CompanyPartnerEntity } from '../../../../_core/domains/entities/company.partner.entity';

@Component({
    templateUrl: './add.company.partner.component.html',
    styleUrls: [
        './add.company.partner.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class AddCompanyPartnerComponent extends EditComponent implements OnInit {
    id: number;
    popup: boolean;
    viewer: boolean;
    @Input() params: any;
    loading: boolean = true;
    service: AdminApiService;
    loadingTemplate: boolean = false;
    item: CompanyPartnerLiteDto = new CompanyPartnerLiteDto();

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
        this.loading = false;
    }
    
    public async confirm(complete: () => void): Promise<boolean> {
        if (this.item) {
            if (await validation(this.item, ['PartnerIds'])) {
                this.processing = true;
                let obj: CompanyPartnerEntity = _.cloneDeep(this.item);

                // save
                return await this.service.callApi('companypartner', 'addnew', obj, MethodType.Post).then((result: ResultApi) => {
                    this.processing = false;
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Save company partner success');
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