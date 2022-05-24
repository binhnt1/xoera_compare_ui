import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { NavigationStateData } from '../../../../_core/domains/data/navigation.state';
import { BrokerLeadEntity } from '../../../../_core/domains/entities/broker.lead.entity';

@Component({
    templateUrl: './edit.broker.lead.component.html',
    styleUrls: [
        './edit.broker.lead.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditBrokerLeadComponent extends EditComponent implements OnInit {
    id: number;
    tab: string;
    popup: boolean;
    viewer: boolean;
    loadingText: string;
    @Input() params: any;
    item: BrokerLeadEntity;
    loading: boolean = true;
    service: AdminApiService;

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

    private async loadItem() {
        if (this.id) {
            await this.service.item('BrokerLead', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(BrokerLeadEntity, result.Object);
                } else {
                    this.item = new BrokerLeadEntity();
                    ToastrHelper.ErrorResult(result);
                }
            });
        } else this.item = new BrokerLeadEntity();
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
                ActionData.saveAddNew('Add new', async () => {
                    await this.confirm(() => {
                        this.edit(this.item);
                    });
                })
            ];
        this.actions = await this.authen.actionsAllow(BrokerLeadEntity, actions);
    }
    private async confirmAndBack() {
        await this.confirm(() => {
            this.back();
        });
    }
    private edit(item: BrokerLeadEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevData: this.state.prevData,
            prevUrl: '/admin/brokerlead',
        };
        this.router.navigate(['/admin/brokerlead/edit'], { state: { params: JSON.stringify(obj) } });
    }
    public async confirm(complete: () => void): Promise<boolean> {
        if (this.item) {
            if (await validation(this.item)) {
                this.processing = true;

                // upload logo
                let obj: BrokerLeadEntity = _.cloneDeep(this.item);
                return await this.service.save('BrokerLead', obj).then((result: ResultApi) => {
                    this.processing = false;
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Save broker lead success');
                        this.item.Id = result.Object;
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