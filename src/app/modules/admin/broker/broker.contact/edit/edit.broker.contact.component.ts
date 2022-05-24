import * as _ from 'lodash';
import { AppInjector } from '../../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { validation } from '../../../../../_core/decorators/validator';
import { ResultApi } from '../../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../../_core/helpers/entity.helper';
import { ActionData } from '../../../../../_core/domains/data/action.data';
import { AdminApiService } from '../../../../../_core/services/admin.api.service';
import { AgencyEntity } from '../../../../../_core/domains/entities/broker.entity';
import { EditComponent } from '../../../../../_core/components/edit/edit.component';
import { AgencyContactEntity } from '../../../../../_core/domains/entities/broker.contact.entity';

@Component({
    templateUrl: './edit.broker.contact.component.html',
    styleUrls: [
        './edit.broker.contact.component.scss',
        '../../../../../../assets/css/modal.scss'
    ],
})
export class EditBrokerContactComponent extends EditComponent implements OnInit {
    id: number;
    popup: boolean;
    viewer: boolean;
    brokerId: number;
    @Input() params: any;
    loading: boolean = true;
    service: AdminApiService;
    item: AgencyContactEntity;

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
            this.addBreadcrumb('Broker Contact');
            if (this.viewer)
                this.addBreadcrumb('View');
            else
                this.addBreadcrumb(this.id ? 'Edit' : 'Add');
            this.renderActions();
        }
        await this.loadItem();
        this.loading = false;
    }
    public async confirm(complete: () => void): Promise<boolean> {
        if (this.item) {
            if (await validation(this.item)) {
                let obj: AgencyContactEntity = _.cloneDeep(this.item);
                return await this.service.save('AgencyContact', obj).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        let messsage = this.id
                            ? 'Save broker contact success'
                            : 'Create broker contact success';
                        ToastrHelper.Success(messsage);
                        if (complete) complete();
                        return true;
                    } else {
                        ToastrHelper.ErrorResult(result);
                        return false;
                    }
                }, () => {
                    return false;
                });
            }
        }
        return false;
    }

    private async loadItem() {        
        if (this.id) {
            await this.service.item('AgencyContact', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(AgencyContactEntity, result.Object);
                    this.item.AgencyId = this.brokerId;
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        } else {
            this.item = new AgencyContactEntity();
            this.item.AgencyId = this.brokerId;
        }
    }
    private async renderActions() {
        let actions: ActionData[] = [ActionData.back(() => { this.back() })];
        if (!this.viewer) {
            let action = this.id
                ? ActionData.saveUpdate('Save', () => { this.confirmAndBack() })
                : ActionData.saveAddNew('Add new', () => { this.confirmAndBack() });
            actions.push(action);
        }
        this.actions = await this.authen.actionsAllow(AgencyEntity, actions);
    }
    private async confirmAndBack() {
        await this.confirm(() => {
            this.back();
        });
    }
}