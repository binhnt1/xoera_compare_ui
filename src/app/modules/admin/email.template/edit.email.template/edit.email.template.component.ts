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
import { EmailTemplateEntity } from '../../../../_core/domains/entities/email.template.entity';
import { EmailTemplateService } from '../email.template.service';

@Component({
    templateUrl: './edit.email.template.component.html',
    styleUrls: [
        './edit.email.template.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditEmailTemplateComponent extends EditComponent implements OnInit {
    id: number;
    popup: boolean;
    viewer: boolean;
    @Input() params: any;
    loading: boolean = true;
    tab: string = 'templateHtml';
    service: EmailTemplateService;
    loadingTemplate: boolean = false;
    item: EmailTemplateEntity = new EmailTemplateEntity();

    constructor() {
        super();
        this.service = AppInjector.get(EmailTemplateService);
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
        this.item = new EmailTemplateEntity();
        if (this.id) {
            await this.service.item('emailtemplate', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(EmailTemplateEntity, result.Object as EmailTemplateEntity);
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
                this.viewer
                    ? ActionData.gotoEdit("Edit", () => { this.edit(this.item) })
                    : ActionData.saveUpdate('Save', () => { this.confirmAndBack() }),
            ]
            : [
                ActionData.back(() => { this.back() }),
                ActionData.saveAddNew('Add new', () => { this.confirmAndBack() })
            ];
        this.actions = await this.authen.actionsAllow(EmailTemplateEntity, actions);
    }
    private async confirmAndBack() {
        await this.confirm(() => {
            this.back();
        });
    }
    private edit(item: EmailTemplateEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevData: this.state.prevData,
            prevUrl: '/admin/emailtemplate',
        };
        this.router.navigate(['/admin/emailtemplate/edit'], { state: { params: JSON.stringify(obj) } });
    }
    public async confirm(complete: () => void): Promise<boolean> {
        if (this.item) {
            if (await validation(this.item)) {
                this.processing = true;
                let obj: EmailTemplateEntity = _.cloneDeep(this.item);
                return await this.service.saveEmail(obj).then((result: ResultApi) => {
                    this.processing = false;
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Save email template success');
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