import * as _ from 'lodash';
import { BrokerService } from '../broker.service';
import { AppInjector } from '../../../../app.module';
import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { ActionType } from '../../../../_core/domains/enums/action.type';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { AgencyEntity } from '../../../../_core/domains/entities/broker.entity';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { NavigationStateData } from '../../../../_core/domains/data/navigation.state';
import { SecurityRightEntity } from '../../../../_core/domains/entities/security.right.entity';

@Component({
    templateUrl: './edit.broker.component.html',
    styleUrls: [
        './edit.broker.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditBrokerComponent extends EditComponent implements OnInit {
    id: number;
    tab: string;
    popup: boolean;
    readonly: boolean;
    item: AgencyEntity;
    loadingText: string;
    @Input() params: any;
    service: BrokerService;
    loading: boolean = true;
    @ViewChild('uploadLogo') uploadLogo: EditorComponent;

    constructor() {
        super();
        this.service = AppInjector.get(BrokerService);
    }

    async ngOnInit() {
        this.tab = this.getParam('tab');
        this.popup = this.getParam('popup');
        this.readonly = this.getParam('readonly');
        this.id = this.getParam('brokerId') || this.getParam('id');
        if (!this.popup) {
            this.addBreadcrumb(this.id ? 'Edit' : 'Add');
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
            await this.service.item('Agency', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(AgencyEntity, result.Object);
                } else {
                    this.item = new AgencyEntity();
                    ToastrHelper.ErrorResult(result);
                }
            });
        } else this.item = new AgencyEntity();
    }
    private async renderActions() {
        let actions: ActionData[] = this.id
            ? [
                ActionData.back(() => { this.back() }),
                this.readonly
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
        this.actions = await this.authen.actionsAllow(AgencyEntity, actions);

        if (this.id) {
            let moreActions: ActionData[] = [
                {
                    icon: 'la la-file',
                    name: 'Broker Agreement',
                    className: 'btn btn-warning',
                    systemName: ActionType.Empty,
                    click: async () => {
                        this.loading = true;
                        this.loadingText = 'Generate File...';
                        (await this.service.viewReport('brokeragreement', this.id)).toPromise().then((data: any) => {
                            switch (data.type) {
                                case HttpEventType.DownloadProgress:
                                    break;
                                case HttpEventType.Response:
                                    const downloadedFile = new Blob([data.body], { type: data.body.type });
                                    const a = document.createElement('a');
                                    a.setAttribute('style', 'display:none;');
                                    document.body.appendChild(a);
                                    a.download = 'broker-agreement.pdf';
                                    a.href = URL.createObjectURL(downloadedFile);
                                    a.target = '_blank';
                                    a.click();
                                    document.body.removeChild(a);
                                    break;
                            }
                            this.loading = false;
                            this.loadingText = null;
                        });
                    }
                },
                {
                    icon: 'la la-file',
                    name: 'TPI Welcome Letter',
                    className: 'btn btn-warning',
                    systemName: ActionType.Empty,
                    click: async () => {
                        this.loading = true;
                        this.loadingText = 'Generate File...';
                        (await this.service.viewReport('tpiwelcomeletter', this.id)).toPromise().then((data: any) => {
                            switch (data.type) {
                                case HttpEventType.DownloadProgress:
                                    break;
                                case HttpEventType.Response:
                                    const downloadedFile = new Blob([data.body], { type: data.body.type });
                                    const a = document.createElement('a');
                                    a.setAttribute('style', 'display:none;');
                                    document.body.appendChild(a);
                                    a.download = 'tpi-wWelcome-letter.pdf';
                                    a.href = URL.createObjectURL(downloadedFile);
                                    a.target = '_blank';
                                    a.click();
                                    document.body.removeChild(a);
                                    break;
                            }
                            this.loading = false;
                            this.loadingText = null;
                        });
                    }
                },
            ];
            this.moreActions = {
                Name: 'Generate',
                Icon: 'la la-bolt',
                Actions: moreActions,
            };
        }
    }
    private async confirmAndBack() {
        await this.confirm(() => {
            this.back();
        });
    }
    private edit(item: AgencyEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevData: this.state.prevData,
            prevUrl: '/admin/broker',
        };
        this.router.navigate(['/admin/broker/edit'], { state: { params: JSON.stringify(obj) } });
    }
    permissionChange(items: SecurityRightEntity[]) {
        if (this.item)
            this.item.Permissions = items;
    }
    public async confirm(complete: () => void): Promise<boolean> {
        if (this.item) {
            if (await validation(this.item)) {
                this.processing = true;

                // upload logo
                let images = await this.uploadLogo.upload();
                let obj: AgencyEntity = _.cloneDeep(this.item);
                obj.AgencyLogoBase64 = images && images.length > 0 && images[0].Base64Data;
                return await this.service.addOrUpdate(obj).then((result: ResultApi) => {
                    this.processing = false;
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Save broker success');
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