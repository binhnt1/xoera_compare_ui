declare var $;
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { AppInjector } from '../../../../../app.module';
import { Component, Input, ViewChild } from '@angular/core';
import { RoleDto } from '../../../../../_core/domains/objects/role.dto';
import { ResultApi } from '../../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../../_core/helpers/entity.helper';
import { ActionData } from '../../../../../_core/domains/data/action.data';
import { StatusType } from '../../../../../_core/domains/enums/status.type';
import { UtilityExHelper } from '../../../../../_core/helpers/utility.helper';
import { EditorComponent } from '../../../../../_core/editor/editor.component';
import { UserEntity } from '../../../../../_core/domains/entities/user.entity';
import { AdminUserUpdateDto } from '../../../../../_core/domains/objects/user.dto';
import { AdminAuthService } from '../../../../../_core/services/admin.auth.service';
import { PermissionDto } from '../../../../../_core/domains/objects/permission.dto';
import { EditComponent } from '../../../../../_core/components/edit/edit.component';
import { OrganizationDto } from '../../../../../_core/domains/objects/organization.dto';
import { AdminDialogService } from '../../../../../_core/services/admin.dialog.service';
import { NavigationStateData } from '../../../../../_core/domains/data/navigation.state';

@Component({
    templateUrl: './view.user.component.html',
    styleUrls: ['./../edit.user/edit.user.component.scss'],
})
export class ViewUserComponent extends EditComponent {
    @Input() params: any;
    actions: ActionData[] = [];
    organizationDistricts: any[];
    organizations: OrganizationDto[];

    prepareForm: boolean;
    loading: boolean = true;
    loadingLocation: boolean;
    loadingPermission: boolean;
    loadingRoleOrganization: boolean;

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
        if (!this.popup) {
            if (this.state) {
                this.id = this.id || this.state.id;
                this.addBreadcrumb(this.id ? 'View account' : 'Add account');
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


    edit(item: AdminUserUpdateDto) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevUrl: '/admin/user',
            prevData: this.state.prevData,
        };
        this.router.navigate(['/admin/user/edit'], { state: { params: JSON.stringify(obj) } });
    }

    permissionChange(items: PermissionDto[], organization: OrganizationDto) {
        organization.Permissions = items && items.filter(c => c.Allow);
    }

    private async renderActions() {
        let actions: ActionData[] = [
            ActionData.back(() => { this.back() }),
            ActionData.gotoEdit("Edit", () => { this.edit(this.item) }),
        ];
        this.actions = await this.authen.actionsAllow(UserEntity, actions);
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
                                FilterRoles: roles,
                                AllPermissions: [],
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