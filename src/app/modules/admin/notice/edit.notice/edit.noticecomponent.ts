import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { NoticeEntity } from '../../../../_core/domains/entities/notice.entity';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { NavigationStateData } from '../../../../_core/domains/data/navigation.state';
import { NoticeAssignType } from '../../../../_core/domains/enums/notice.assign.type';

@Component({
    templateUrl: './edit.notice.component.html',
    styleUrls: [
        './edit.notice.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditNoticeComponent extends EditComponent implements OnInit {
    id: number;
    popup: boolean;
    viewer: boolean;
    @Input() params: any;
    loading: boolean = true;
    service: AdminApiService;
    NoticeAssignType = NoticeAssignType;
    item: NoticeEntity = new NoticeEntity();

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

    selectedUserIds(ids: number[]) {
        this.item.UserIds = ids;
        this.item.AssignUsers = ids ? JSON.stringify(ids) : null;
    }

    private async loadItem() {
        this.item = new NoticeEntity();
        if (this.id) {
            await this.service.item('notice', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(NoticeEntity, result.Object);
                    this.item.UserIds = this.item.AssignUsers && JSON.parse(this.item.AssignUsers);
                    this.item.AssignType = this.item.MustAgree 
                        ? (this.item.UserIds && this.item.UserIds.length > 0 
                            ? NoticeAssignType.SpecificUsers 
                            : NoticeAssignType.AllUser)
                        : NoticeAssignType.SpecificUsers;
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
        this.actions = await this.authen.actionsAllow(NoticeEntity, actions);
    }
    private async confirmAndBack() {
        await this.confirm(() => {
            this.back();
        });
    }
    private edit(item: NoticeEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevData: this.state.prevData,
            prevUrl: '/admin/notice',
        };
        this.router.navigate(['/admin/notice/edit'], { state: { params: JSON.stringify(obj) } });
    }
    public async confirm(complete: () => void): Promise<boolean> {
        if (this.item) {
            if (await validation(this.item)) {
                this.processing = true;
                let obj: NoticeEntity = _.cloneDeep(this.item);
                return await this.service.save('notice', obj).then((result: ResultApi) => {
                    this.processing = false;
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Save notice success');
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