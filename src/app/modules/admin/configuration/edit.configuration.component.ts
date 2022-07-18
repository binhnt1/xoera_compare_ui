import * as _ from 'lodash';
import { AppInjector } from '../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { validation } from '../../../_core/decorators/validator';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../_core/helpers/entity.helper';
import { ActionData } from '../../../_core/domains/data/action.data';
import { MethodType } from '../../../_core/domains/enums/method.type';
import { AdminApiService } from '../../../_core/services/admin.api.service';
import { EditComponent } from '../../../_core/components/edit/edit.component';
import { ConfigurationEntity } from '../../../_core/domains/entities/configuration.entity';

@Component({
    templateUrl: './edit.configuration.component.html',
    styleUrls: ['./edit.configuration.component.scss'],
})
export class EditConfigurationComponent extends EditComponent implements OnInit {
    id: number;
    popup: boolean;
    viewer: boolean;
    @Input() params: any;
    loading: boolean = true;
    service: AdminApiService;
    item: ConfigurationEntity = new ConfigurationEntity();

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
                this.addBreadcrumb(this.id ? (this.viewer ? 'View' : 'Edit') : 'Add');
            }
            this.renderActions();
        }
        await this.loadItem();
        this.loading = false;
    }

    private async loadItem() {
        this.item = new ConfigurationEntity();
        await this.service.callApi('configuration', 'item').then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                this.item = EntityHelper.createEntity(ConfigurationEntity, result.Object as ConfigurationEntity);
            } else {
                ToastrHelper.ErrorResult(result);
            }
        });
    }
    private async renderActions() {
        let actions: ActionData[] = [ActionData.saveUpdate('Save', () => { this.confirm() })];
        this.actions = await this.authen.actionsAllow(ConfigurationEntity, actions);
    }
    public async confirm(): Promise<boolean> {
        if (this.item) {
            if (await validation(this.item)) {
                this.processing = true;
                let obj: ConfigurationEntity = _.cloneDeep(this.item);
                return await this.service.callApi('configuration', 'save', obj, MethodType.Post).then((result: ResultApi) => {
                    this.processing = false;
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Save configuration success');
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