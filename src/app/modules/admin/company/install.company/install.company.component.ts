import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { CompanyDto } from '../../../../_core/domains/objects/company.dto';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { EditComponent } from '../../../../_core/components/edit/edit.component';

@Component({
    templateUrl: './install.company.component.html',
    styleUrls: [
        './install.company.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class InstallCompanyComponent extends EditComponent implements OnInit {
    id: number;
    @Input() params: any;
    loading: boolean = true;
    service: AdminApiService;
    item: CompanyDto = new CompanyDto();

    constructor() {
        super();
        this.service = AppInjector.get(AdminApiService);
        this.state = this.getUrlState();
    }

    async ngOnInit() {
        this.id = this.params && this.params['id'];
        if (this.state) {
            this.id = this.state.id;
            this.addBreadcrumb('Install');
        }
        this.renderActions();
        await this.loadItem();
        this.loading = false;
    }

    private async loadItem() {
        this.item = new CompanyDto();
        if (this.id) {
            await this.service.callApi('company', 'item/' + this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(CompanyDto, result.Object as CompanyDto);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
    }
    private async renderActions() {
        let actions: ActionData[] = this.id
            ? [
                ActionData.back(() => { this.back() }),
            ]
            : [
                ActionData.back(() => { this.back() }),
            ];
        this.actions = await this.authen.actionsAllow(CompanyDto, actions);
    }
}