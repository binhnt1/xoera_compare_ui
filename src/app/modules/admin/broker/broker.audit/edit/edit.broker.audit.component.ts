import * as _ from 'lodash';
import { AppInjector } from '../../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { ResultApi } from '../../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../../_core/helpers/entity.helper';
import { ActionData } from '../../../../../_core/domains/data/action.data';
import { AuditEntity } from '../../../../../_core/domains/entities/audit.entity';
import { AdminApiService } from '../../../../../_core/services/admin.api.service';
import { AgencyEntity } from '../../../../../_core/domains/entities/broker.entity';
import { EditComponent } from '../../../../../_core/components/edit/edit.component';

@Component({
    templateUrl: './edit.broker.audit.component.html',
    styleUrls: [
        './edit.broker.audit.component.scss',
        '../../../../../../assets/css/modal.scss'
    ],
})
export class EditBrokerAuditComponent extends EditComponent implements OnInit {
    id: number;
    popup: boolean;
    viewer: boolean;
    brokerId: number;
    item: AuditEntity;
    @Input() params: any;
    loading: boolean = true;
    service: AdminApiService;

    constructor() {
        super();
        this.service = AppInjector.get(AdminApiService);
    }

    async ngOnInit() {
        this.id = this.getParam('id');
        this.popup = this.getParam('popup');
        this.viewer = this.getParam('viewer');
        this.brokerId = this.getParam('brokerId');
        if (!this.popup) {
            this.addBreadcrumb('Broker Audit');
            if (this.viewer)
                this.addBreadcrumb('View');
            else
                this.addBreadcrumb(this.id ? 'Edit' : 'Add');
            this.renderActions();
        }
        await this.loadItem();
        this.loading = false;
    }

    private async loadItem() {        
        if (this.id) {
            await this.service.item('Audit', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(AuditEntity, result.Object);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        } else {
            this.item = new AuditEntity();
        }
    }
    private async renderActions() {
        let actions: ActionData[] = [ActionData.back(() => { this.back() })];
        this.actions = await this.authen.actionsAllow(AgencyEntity, actions);
    }
}