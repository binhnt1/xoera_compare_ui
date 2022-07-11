import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { AdminApiService } from '../../../_core/services/admin.api.service';
import { AdminAuthService } from '../../../_core/services/admin.auth.service';
import { AdminEventService } from '../../../_core/services/admin.event.service';
import { AdminDialogService } from '../../../_core/services/admin.dialog.service';
import { CompanyDto } from 'src/app/_core/domains/objects/company.dto';
import { ResultApi } from 'src/app/_core/domains/data/result.api';
import { EntityHelper } from 'src/app/_core/helpers/entity.helper';
import { MethodType } from 'src/app/_core/domains/enums/method.type';
import { ToastrHelper } from 'src/app/_core/helpers/toastr.helper';

@Component({
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    item: CompanyDto;
    loading: boolean = true;
    activePrice: boolean = true;
    activeProfile: boolean = true;
    activeLicence: boolean = true;
    activeExchange: boolean = true;
    readonlyIsPublic: boolean = false;

    constructor(
        public auth: AdminAuthService,
        public event: AdminEventService,
        public service: AdminApiService,
        public dialog: AdminDialogService) {
    }

    ngOnInit(): void {
        this.service.callApi('company', 'item').then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                this.item = EntityHelper.createEntity(CompanyDto, result.Object);
                this.readonlyIsPublic = this.item.IsPublic;
            }
            this.loading = false;
        });
    }

    public() {
        if (this.item.IsPublic) {
            this.dialog.ConfirmAsync('Do you want public profile?', async () => {
                this.service.callApi('company', 'Public', null, MethodType.Post).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        this.readonlyIsPublic = true;
                        ToastrHelper.Success('Public profile success');
                    } else ToastrHelper.ErrorResult(result);
                })
            }, () => this.item.IsPublic = false);
        }
    }
}
