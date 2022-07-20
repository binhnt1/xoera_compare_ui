declare var $;
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { AppInjector } from '../../../../../app.module';
import { Component, Input, ViewChild } from '@angular/core';
import { LockUserComponent } from '../lock.user/lock.user.component';
import { validation } from '../../../../../_core/decorators/validator';
import { RoleDto } from '../../../../../_core/domains/objects/role.dto';
import { ResultApi } from '../../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../../_core/helpers/entity.helper';
import { ActionData } from '../../../../../_core/domains/data/action.data';
import { ActionType } from '../../../../../_core/domains/enums/action.type';
import { StatusType } from '../../../../../_core/domains/enums/status.type';
import { EditRoleComponent } from '../../role/edit.role/edit.role.component';
import { ViewRoleComponent } from '../../role/view.role/view.role.component';
import { UtilityExHelper } from '../../../../../_core/helpers/utility.helper';
import { EditorComponent } from '../../../../../_core/editor/editor.component';
import { UserEntity } from '../../../../../_core/domains/entities/user.entity';
import { AdminUserUpdateDto } from '../../../../../_core/domains/objects/user.dto';
import { ModalSizeType } from '../../../../../_core/domains/enums/modal.size.type';
import { AdminAuthService } from '../../../../../_core/services/admin.auth.service';
import { PermissionDto } from '../../../../../_core/domains/objects/permission.dto';
import { EditComponent } from '../../../../../_core/components/edit/edit.component';
import { UserActivityHelper } from '../../../../../_core/helpers/user.activity.helper';
import { OrganizationDto } from '../../../../../_core/domains/objects/organization.dto';
import { AdminDialogService } from '../../../../../_core/services/admin.dialog.service';
import { NavigationStateData } from '../../../../../_core/domains/data/navigation.state';

@Component({
    templateUrl: './edit.user.component.html',
    styleUrls: ['./edit.user.component.scss'],
})
export class EditUserComponent extends EditComponent {
    @Input() params: any;
    organizations: OrganizationDto[];

    allowAddRole: boolean;
    allowAddTeam: boolean;
    loading: boolean = true;
    loadingLocation: boolean;
    loadingPermission: boolean;
    loadingRoleOrganization: boolean;
    loadingTeamOrganization: boolean;

    id: number;
    popup: boolean;
    router: Router;
    searchRole: string;
    searchTeam: string;
    state: NavigationStateData;
    tab: string = 'information';
    innerTab: string = 'kt_tab_roles';
    item: AdminUserUpdateDto = new AdminUserUpdateDto();

    service: UserService;
    authen: AdminAuthService;
    dialog: AdminDialogService;

    @ViewChild('uploadAvatar') uploadAvatar: EditorComponent;

    constructor() {
        super();
        this.router = AppInjector.get(Router);
        this.service = AppInjector.get(UserService);
        this.authen = AppInjector.get(AdminAuthService);
        this.dialog = AppInjector.get(AdminDialogService);

        this.organizations = [];
        this.state = this.getUrlState();
    }

    async ngOnInit() {
        this.id = this.params && this.params['id'];
        this.popup = this.params && this.params['popup'];
        this.allowAddRole = await this.authen.permissionAllow('role', ActionType.AddNew);
        this.allowAddTeam = await this.authen.permissionAllow('team', ActionType.AddNew);
        if (!this.popup) {
            if (this.state) {
                this.id = this.id || this.state.id;
                this.addBreadcrumb(this.id ? 'Edit account' : 'Add account');
            }
            this.renderActions();
        }

        await this.loadItem();
        this.loading = false;

        await this.loadRoles();
        await this.loadPermissions();
    }

    selectedTab(tab: string) {
        this.tab = tab;
    }
    selectedInnerTab(tab: string) {
        this.innerTab = tab;
    }
    toggleOrganization(organization: OrganizationDto) {
        organization.Active = !organization.Active;
    }
    toggleOrganizationPermission(organization: OrganizationDto) {
        organization.PermissionActive = !organization.PermissionActive;
    }

    openPopupRole(id?: number) {
        if (id) {
            this.dialog.WapperAsync({
                title: 'View role',
                cancelText: 'Close',
                objectExtra: { id: id },
                object: ViewRoleComponent,
                size: ModalSizeType.FullScreen,
            });
        } else {
            this.dialog.WapperAsync({
                cancelText: 'Close',
                title: 'Create role',
                confirmText: 'Create role',
                object: EditRoleComponent,
                size: ModalSizeType.FullScreen,
            }, async () => {
                await this.loadRoles();
                await this.loadPermissions();
            });
        }
    }

    async refreshRoles() {
        await this.loadRoles();
        await this.loadPermissions();
    }
    async roleOrganizationChange() {
        await this.loadRoles();
        await this.loadPermissions();
    }
    async allowRole(role: RoleDto) {
        role.Allow = true;
        let item = this.organizations.find(c => c.Id == 1);
        if (item) {
            item.Roles = item.AllRoles.filter(c => c.Allow);
        }
        await this.loadPermissions();
    }
    async removeRole(role: RoleDto) {
        role.Allow = false;
        let item = this.organizations.find(c => c.Id == 1);
        if (item) {
            item.Roles = item.AllRoles.filter(c => c.Allow);
        }
        await this.loadPermissions();
    }
    filterRole(text: string, organization: OrganizationDto) {
        if (organization && organization.Roles) {
            organization.FilterRoles = text
                ? organization.AllRoles.filter(c =>
                    (c.Name && c.Name.toLowerCase().indexOf(text.toLowerCase()) >= 0) ||
                    (c.Code && c.Code.toLowerCase().indexOf(text.toLowerCase()) >= 0))
                : organization.AllRoles;
        }
    }

    permissionChange(items: PermissionDto[], organization: OrganizationDto) {
        organization.Permissions = items && items.filter(c => c.Allow);
    }

    public async confirmAndBack() {
        await this.confirm(() => {
            this.back();
        });
    }
    public async confirmAndReset() {
        await this.confirm(() => {
            this.state.id = null;
            this.item = new AdminUserUpdateDto();
            this.router.navigate(['/admin/user/add'], { state: { params: JSON.stringify(this.state) } });
        });
    }
    public async confirm(complete: () => void): Promise<boolean> {
        if (this.item) {
            this.processing = true;
            if (await validation(this.item, ['FirstName', 'LastName', 'Phone', 'Email'])) {
                this.processing = true;

                // upload
                let images = await this.uploadAvatar.image.upload();

                // update user
                let obj: AdminUserUpdateDto = _.cloneDeep(this.item);
                obj.Avatar = images && images.length > 0 ? images[0].Path : '';
                obj.RoleIds = this.organizations && this.organizations.flatMap(c => c.Roles).map(c => c.Id);
                obj.Permissions = this.organizations && this.organizations.flatMap(c => c.Permissions).filter(c => c.Allow).filter(c => !c.ReadOnly)
                    .map(c => {
                        return {
                            Id: c.Id
                        };
                    });
                obj.RawPassword = UtilityExHelper.randomText(6);
                obj.Password = UserActivityHelper.CreateHash256(obj.RawPassword);
                return await this.service.addOrUpdate(obj).then((result: ResultApi) => {
                    this.processing = false;
                    if (ResultApi.IsSuccess(result)) {
                        if (this.id) ToastrHelper.Success('Save data success');
                        else {
                            this.dialog.Alert('Message', '<p>Create account success</p><p>The system has sent email notifications to account</p>');
                        }
                        if (complete) complete();
                        return true;
                    } else {
                        ToastrHelper.ErrorResult(result);
                        return false;
                    }
                }, () => {
                    return false;
                });
            } else this.processing = false;
        }
        return false;
    }

    private async loadItem() {
        if (this.id) {
            await this.service.item('user', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(AdminUserUpdateDto, result.Object);
                    this.item.Id = this.id;
                    let text = this.item.Locked ? 'Locked' : 'Active',
                        status = this.item.Locked ? StatusType.Warning : StatusType.Success;
                    this.item["Status"] = UtilityExHelper.formatText(text, status);
                }
            });
        }
    }
    private async loadRoles() {
        this.organizations = [];
        this.loadingRoleOrganization = true;
        await this.service.allRoles(this.id).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                let roles = result.Object as RoleDto[];
                if (roles && roles.length > 0) {
                    roles.forEach((role: RoleDto) => {
                        let item = this.organizations.find(c => c.Id == 1);
                        if (!item) {
                            item = {
                                Id: 1,
                                Active: true,
                                Name: 'Roles',
                                Permissions: [],
                                AllRoles: roles,
                                AllPermissions: [],
                                FilterRoles: roles,
                                Roles: roles.filter(c => c.Allow),
                            };
                            this.organizations.push(item);
                        }
                    });
                }
            }
            this.loadingRoleOrganization = false;
        });
    }
    private async renderActions() {
        let actions: ActionData[] = this.id
            ? [
                ActionData.back(() => { this.back() }),
                ActionData.saveUpdate('Save', () => { this.confirmAndBack() }),
                this.item.Locked
                    ? {
                        icon: 'la la-unlock',
                        name: ActionType.UnLock,
                        systemName: ActionType.UnLock,
                        className: 'btn btn-outline-primary',
                        click: (() => {
                            let name = this.item.FirstName + ' ' + this.item.LastName;
                            this.dialogService.ConfirmAsync('Confirm unlock for the account <b>' + name + '</b>', async () => {
                                await this.service.unLockUser(this.item.Id).then(async (result: ResultApi) => {
                                    if (ResultApi.IsSuccess(result)) {
                                        ToastrHelper.Success('UnLock account success');
                                        await this.loadItem();
                                        this.renderActions();
                                    } else ToastrHelper.ErrorResult(result);
                                });
                            });
                        })
                    }
                    : {
                        icon: 'la la-lock',
                        name: ActionType.Lock,
                        systemName: ActionType.Lock,
                        className: 'btn btn-outline-primary',
                        click: (() => {
                            this.dialogService.WapperAsync({
                                cancelText: 'Close',
                                title: 'Lock account',
                                confirmText: 'Confirm',
                                object: LockUserComponent,
                                size: ModalSizeType.Large,
                                objectExtra: { id: this.item.Id },
                            }, async () => {
                                await this.loadItem();
                                this.renderActions();
                            });
                        })
                    },
                this.item.Locked
                    ? null
                    : {
                        icon: 'la la-key',
                        name: ActionType.ResetPassword,
                        systemName: ActionType.ResetPassword,
                        className: 'btn btn-outline-primary',
                        click: (() => {
                            let name = this.item.FirstName + ' ' + this.item.LastName;
                            this.dialogService.ConfirmAsync('Reset password for account <b>' + name + '</b>', async () => {
                                await this.service.adminResetPassword(this.item.Id).then((result: ResultApi) => {
                                    if (ResultApi.IsSuccess(result)) {
                                        if (result.Object) ToastrHelper.Success('The system has sent an email to set up a new password for account');
                                        else ToastrHelper.Error('Can\'t send email for account');
                                    } else ToastrHelper.ErrorResult(result);
                                });
                            });
                        })
                    },
            ]
            : [
                ActionData.back(() => { this.back() }),
                ActionData.saveAddNew('Create account', () => { this.confirmAndBack() })
            ];
        this.actions = await this.authen.actionsAllow(UserEntity, actions);
    }
    private async loadPermissions() {
        this.loadingPermission = true;
        let roleIds = this.organizations.flatMap(c => c.Roles).filter(c => c.Allow).map(c => c.Id);
        await this.service.allPermissions(this.id, roleIds).then((result: ResultApi) => {
            this.loadingPermission = false;
            if (ResultApi.IsSuccess(result)) {
                let items = result.Object as PermissionDto[];
                this.organizations.forEach((item: OrganizationDto) => {
                    item.AllPermissions = items && items;
                    item.Permissions = item.AllPermissions.filter(c => c.Allow);
                });
            } else {
                ToastrHelper.ErrorResult(result);
            }
        });
    }
}