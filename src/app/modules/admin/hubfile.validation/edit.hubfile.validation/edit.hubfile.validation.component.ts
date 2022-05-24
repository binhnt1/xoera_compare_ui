import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { FlowType, MultipleAllowedType } from '../../../../_core/domains/enums/flow.type';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { NavigationStateData } from '../../../../_core/domains/data/navigation.state';
import { FlowDirectionType } from '../../../../_core/domains/enums/flow.direction.type';
import { HubFileValidationEntity } from '../../../../_core/domains/entities/hubfile.validation.entity';

@Component({
    templateUrl: './edit.hubfile.validation.component.html',
    styleUrls: [
        './edit.hubfile.validation.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditHubFileValidationComponent extends EditComponent implements OnInit {
    id: number;
    popup: boolean;
    viewer: boolean;
    @Input() params: any;
    loading: boolean = true;
    service: AdminApiService;
    tab: string = 'templateHtml';
    loadingTemplate: boolean = false;
    item: HubFileValidationEntity = new HubFileValidationEntity();

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
            this.renderActions();
        }
        await this.loadItem();
        this.loading = false;
    }

    selectedTab(tab: string) {
        this.tab = tab;
    }

    parentNodeChange() {

    }

    responseNodeChange() {
    }

    private async loadItem() {
        this.item = new HubFileValidationEntity();
        if (this.id) {
            await this.service.item('hubfilevalidation', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(HubFileValidationEntity, result.Object as HubFileValidationEntity);
                    if (!this.item.MultipleAllowed)
                        this.item.MultipleAllowed = MultipleAllowedType.DontAllow;
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        } else {
            this.item.Type = FlowType.SPA;
            this.item.Direction = FlowDirectionType.Incoming;
            this.item.MultipleAllowed = MultipleAllowedType.DontAllow;
        }
    }
    private async renderActions() {
        let actions: ActionData[] = this.id
            ? [
                ActionData.back(() => { this.back() }),
                this.viewer
                    ? ActionData.gotoEdit("Edit", () => { this.edit(this.item) })
                    : ActionData.saveUpdate('Save', () => { this.confirmAndBack() }),
            ]
            : [
                ActionData.back(() => { this.back() }),
                ActionData.saveAddNew('Add new', () => { this.confirmAndBack() })
            ];
        this.actions = await this.authen.actionsAllow(HubFileValidationEntity, actions);
    }
    private async confirmAndBack() {
        await this.confirm(() => {
            this.back();
        });
    }
    private edit(item: HubFileValidationEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevData: this.state.prevData,
            prevUrl: '/admin/hubfilevalidation',
        };
        this.router.navigate(['/admin/hubfilevalidation/edit'], { state: { params: JSON.stringify(obj) } });
    }
    public async confirm(complete: () => void): Promise<boolean> {
        if (this.item) {
            if (await validation(this.item)) {
                let obj: HubFileValidationEntity = _.cloneDeep(this.item);
                return await this.service.save('hubfilevalidation', obj).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Save hubfile validation success');
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
}