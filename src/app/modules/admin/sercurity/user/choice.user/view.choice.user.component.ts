import * as _ from 'lodash';
import { UserService } from "../user.service";
import { RoleService } from "../../role/role.service";
import { AppInjector } from "../../../../../app.module";
import { Component, Input, OnInit } from "@angular/core";
import { ChoiceUserComponent } from "./choice.user.component";
import { ViewUserComponent } from "../view.user/view.user.component";
import { GridData } from "../../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../../_core/domains/enums/data.type";
import { ResultApi } from "../../../../../_core/domains/data/result.api";
import { ToastrHelper } from "../../../../../_core/helpers/toastr.helper";
import { PagingData } from "../../../../../_core/domains/data/paging.data";
import { ActionType } from "../../../../../_core/domains/enums/action.type";
import { UtilityExHelper } from '../../../../../_core/helpers/utility.helper';
import { UserEntity } from "../../../../../_core/domains/entities/user.entity";
import { ModalSizeType } from "../../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../../_core/components/grid/grid.component";

@Component({
    selector: 'view-choice-user',
    templateUrl: '../../../../../_core/components/grid/grid.component.html',
})
export class ViewChoiceUserComponent extends GridComponent implements OnInit {
    id: number;
    type: string;
    addUser: boolean;
    autoSave: boolean;
    groupUser: boolean;
    navigation: boolean;
    deleteUser: boolean;
    choiceComplete: () => void;

    @Input() params: any;
    selectedItems: any[] = [];
    obj: GridData = {
        Exports: [],
        Imports: [],
        Filters: [],
        Actions: [],
        Features: [],
        IsPopup: true,
        UpdatedBy: false,
        Reference: UserEntity,
        HideCustomFilter: true,
        Title: 'View List Accounts',
        InlineFilters: ['DepartmentId', 'PositionId']
    };

    roleService: RoleService;
    userService: UserService;

    constructor() {
        super();
        this.roleService = AppInjector.get(RoleService);
        this.userService = AppInjector.get(UserService);
        let allowViewUser = this.authen.permissionAllow('user', ActionType.View);
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            allowViewUser
                ? {
                    Property: 'FullName', Type: DataType.String,
                    Click: (item: any) => {
                        this.view(item);
                    }
                }
                : { Property: 'FullName', Type: DataType.String },
            { Property: 'Phone', Type: DataType.String },
            { Property: 'Email', Type: DataType.String },
            { Property: 'Avatar', Type: DataType.Image, Align: 'center' },
        ];
    }

    async ngOnInit() {
        this.type = this.params && this.params['type'];
        this.id = this.params && this.params['id'] || 0;
        this.addUser = this.params && this.params['addUser'];
        this.autoSave = this.params && this.params['autoSave'];
        this.groupUser = this.params && this.params['groupUser'];
        this.deleteUser = this.params && this.params['deleteUser'];
        this.navigation = this.params && this.params['navigation'];
        this.choiceComplete = this.params && this.params['choiceComplete'];

        if (this.addUser) {
            this.obj.Features.push({
                icon: 'la la-users',
                className: 'btn btn-primary',
                name: ActionType.EditMember,
                systemName: ActionType.EditMember,
                click: (() => {
                    this.popupChoiceUser();
                })
            });
        }
        if (this.groupUser) {
            let allowViewUser = this.authen.permissionAllow('user', ActionType.View);
            this.properties = [
                { Property: 'Id', Type: DataType.Number },
                allowViewUser
                    ? {
                        Property: 'FullName', Type: DataType.String,
                        Format: ((item: any) => {
                            item['Name'] = UtilityExHelper.escapeHtml(item.FullName);
                            let text = '<a routerLink="view">' + UtilityExHelper.escapeHtml(item.FullName) + '</a>';
                            if (item.Phone) text += '<p><i class=\'la la-phone\'></i> ' + item.Phone + '</p>';
                            if (item.Email) text += '<p><i class=\'la la-inbox\'></i> ' + item.Email + '</p>';
                            return text;
                        })
                    }
                    : {
                        Property: 'FullName', Type: DataType.String,
                        Format: ((item: any) => {
                            item['Name'] = UtilityExHelper.escapeHtml(item.FullName);
                            let text = '<p>' + UtilityExHelper.escapeHtml(item.FullName) + '</p>';
                            if (item.Phone) text += '<p><i class=\'la la-phone\'></i> ' + item.Phone + '</p>';
                            if (item.Email) text += '<p><i class=\'la la-inbox\'></i> ' + item.Email + '</p>';
                            return text;
                        })
                    },
            ];
        }
        if (this.deleteUser) {
            this.obj.Actions.push({
                icon: 'la la-trash',
                name: ActionType.Delete,
                className: 'btn btn-danger',
                systemName: ActionType.EditMember,
                click: (item: any) => {
                    this.delete(item);
                }
            });
        }
        if (!this.groupUser) this.breadcrumbs = [{ Name: 'Accounts' }];

        if (this.type) {
            switch (this.type.toLowerCase()) {
                case 'role': {
                    this.obj.Url = '/admin/user/ChoiceItems/role/' + this.id;
                } break;
            }
            if (!this.itemData.Paging)
                this.itemData.Paging = new PagingData();
            this.itemData.Paging.Size = 10000;
            await this.render(this.obj);
            this.selectedItems = _.cloneDeep(this.items);
        } else this.obj.HideSearch = true;
    }

    view(item: any) {
        this.dialogService.WapperAsync({
            title: 'Account',
            cancelText: 'Close',
            object: ViewUserComponent,
            objectExtra: { id: item.Id },
            size: ModalSizeType.FullScreen,
        }, null, null, null, () => {
            if (this.navigation) this.popupViewChoiceUser();
        });
    }

    popupChoiceUser() {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            title: 'Add Account',
            confirmText: 'Choice',
            object: ChoiceUserComponent,
            size: ModalSizeType.ExtraLarge,
            objectExtra: {
                id: this.id,
                type: this.type,
                autoSave: this.autoSave,
                choiceComplete: ((items: any[]) => {
                    if (!this.items) this.items = [];
                    if (items && items.length > 0) {
                        this.items.unshift(...items);
                    }
                }),
                ignoreIds: this.items && this.items.map(c => c.Id),
            },
        }, async () => {
            if (this.choiceComplete)
                this.choiceComplete();
        });
    }

    popupViewChoiceUser() {
        setTimeout(() => {
            let addUser = this.authen.permissionAllow(this.type, ActionType.EditMember);
            let deleteUser = this.authen.permissionAllow(this.type, ActionType.EditMember);
            this.dialogService.WapperAsync({
                title: 'Account',
                cancelText: 'Close',
                confirmText: 'Save',
                size: ModalSizeType.ExtraLarge,
                object: ViewChoiceUserComponent,
                objectExtra: {
                    id: this.id,
                    autoSave: true,
                    type: this.type,
                    addUser: addUser,
                    navigation: true,
                    deleteUser: deleteUser
                },
            }, async () => {
                this.loadItems();
            });
        }, 100);
    }

    public delete(item: any) {
        this.dialogService.Confirm('Are you want remove account <b>' + (item.Name || item.FullName) + '</b> from the list?', () => {
            if (!this.obj.IgnoreIds)
                this.obj.IgnoreIds = [];
            this.obj.IgnoreIds.push(item.Id);
            this.items = this.items.filter(c => c.Id != item.Id);
        });
    }
    public async confirm(): Promise<boolean> {
        if (this.id) {
            let type: string = this.params && this.params['type'];
            switch (type) {
                case 'role': return await this.confirmByRole(this.id);
            }
        }
        return false;
    }

    private async confirmByRole(roleId: number) {
        let ids = this.items.map(c => c.Id);
        return await this.roleService.updateUsers(roleId, ids).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                ToastrHelper.Success('Save data success');
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