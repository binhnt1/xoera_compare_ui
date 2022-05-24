import * as _ from 'lodash';
import { RoleService } from '../role.service';
import { UserService } from '../../user/user.service';
import { AppInjector } from '../../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { UserDto } from '../../../../../_core/domains/objects/user.dto';
import { RoleDto } from '../../../../../_core/domains/objects/role.dto';
import { ResultApi } from '../../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../../_core/helpers/entity.helper';
import { ActionData } from '../../../../../_core/domains/data/action.data';
import { ButtonType } from '../../../../../_core/domains/enums/button.type';
import { UtilityExHelper } from '../../../../../_core/helpers/utility.helper';
import { RoleEntity } from '../../../../../_core/domains/entities/role.entity';
import { EditComponent } from '../../../../../_core/components/edit/edit.component';
import { PermissionDto } from '../../../../../_core/domains/objects/permission.dto';
import { AdminDialogService } from '../../../../../_core/services/admin.dialog.service';
import { NavigationStateData } from '../../../../../_core/domains/data/navigation.state';

@Component({
    templateUrl: './view.role.component.html',
    styleUrls: [
        './view.role.component.scss',
        '../../../../../../assets/css/modal.scss'
    ],
})
export class ViewRoleComponent extends EditComponent implements OnInit {
    @Input() params: any;
    id: number;
    popup: boolean;
    users: UserDto[];
    permissions: any[];
    items: PermissionDto[];
    loading: boolean = true;
    ButtonType = ButtonType;
    userService: UserService;
    loadingPermission: boolean;
    item: RoleDto = new RoleDto();

    service: RoleService;
    dialogService: AdminDialogService;

    constructor() {
        super();
        this.service = AppInjector.get(RoleService);
        this.userService = AppInjector.get(UserService);
        this.dialogService = AppInjector.get(AdminDialogService);

        this.state = this.getUrlState();
    }

    async ngOnInit() {
        this.id = this.params && this.params['id'];
        this.popup = this.params && this.params['popup'];
        if (!this.popup) {
            if (this.state) {
                this.addBreadcrumb('View role');
                this.id = this.id || this.state.id;
            }
            this.renderActions();
        }
        await this.loadItem();
        await this.loadPermissions();
        this.loading = false;
    }

    edit(item: RoleDto) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevUrl: '/admin/role',
            prevData: this.state.prevData,
        };
        this.router.navigate(['/admin/role/edit'], { state: { params: JSON.stringify(obj) } });
    }

    permissionChange(permissions: PermissionDto[]) {
        this.item.Permissions = permissions.filter(c => c.Allow);
    }

    private async loadItem() {
        this.item = new RoleDto();
        if (this.id) {
            await this.service.item('role', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(RoleDto, result.Object as RoleDto);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
    }
    private async renderActions() {
        let actions: ActionData[] = [
            ActionData.back(() => { this.back() }),
            ActionData.gotoEdit("Edit role", () => { this.edit(this.item) }),
            ActionData.history(() => { this.viewHistory(this.item.Id, 'role') })
        ];
        this.actions = await this.authen.actionsAllow(RoleEntity, actions);
    }
    private async loadPermissions() {      
        this.loadingPermission = true;
        await this.service.allPermissions(this.id).then((result: ResultApi) => {
            this.loadingPermission = false;
            if (ResultApi.IsSuccess(result)) {
                this.items = result.Object as PermissionDto[];
                if (this.items && this.items.length > 0) {
                    let groups = _(this.items)
                        .groupBy((x: PermissionDto) => x.Group)
                        .map((value: PermissionDto[], key: string) => ({ group: key, items: value }))
                        .value();
                    if (groups && groups.length > 0) {
                        groups.forEach((group: any) => {
                            if (group.items && group.items.length > 0) {
                                group.items = _(group.items)
                                    .groupBy((x: PermissionDto) => x.Title)
                                    .map((value: PermissionDto[], key: string) => ({
                                        title: key,
                                        permissions: value,
                                        id: UtilityExHelper.randomText(8),
                                        selected: value.findIndex(c => c.Allow) >= 0,
                                    }))
                                    .value();
                            }
                        });
                    }
                    this.permissions = groups;
                }
            } else {
                ToastrHelper.ErrorResult(result);
            }
        });
    }
}