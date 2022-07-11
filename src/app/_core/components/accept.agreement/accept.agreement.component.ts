import * as _ from 'lodash';
import { AppInjector } from '../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { ResultApi } from '../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { MethodType } from '../../../_core/domains/enums/method.type';
import { AdminApiService } from '../../../_core/services/admin.api.service';
import { AdminDialogService } from '../../../_core/services/admin.dialog.service';
import { AgreementEntity } from '../../../_core/domains/entities/agreement.entity';

@Component({
    templateUrl: './accept.agreement.component.html',
    styleUrls: ['./accept.agreement.component.scss'],
})
export class AcceptAgreementComponent implements OnInit {
    processing: boolean;
    @Input() params: any;
    item: AgreementEntity;
    service: AdminApiService;
    items: AgreementEntity[];
    dialog: AdminDialogService;

    constructor() {
        this.service = AppInjector.get(AdminApiService);
        this.dialog = AppInjector.get(AdminDialogService);
    }

    async ngOnInit() {
        this.items = this.params && this.params['items'];
        if (this.items && this.items.length > 0)
            this.item = this.items[0];
    }
    public async confirm() {
        if (this.item) {
            this.processing = true;
            await this.service.callApi('UserAgreement', 'Agreed/' + this.item.Id, null, MethodType.Post).then((result: ResultApi) => {
                this.processing = false;
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success('Agreed agreement success');
                    this.items = this.items.filter(c => c.Id != this.item.Id);
                    if (this.items && this.items.length > 0)
                        this.item = this.items[0];
                    else {
                        this.dialog.HideAllDialog();
                        this.item = null;
                    }
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            }, () => {
                this.processing = false;
            });
        }
    }
}