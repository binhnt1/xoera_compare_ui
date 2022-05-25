import { UserService } from "../user.service";
import { AppInjector } from "../../../../../app.module";
import { RoleService } from "../../role/role.service";
import { Component, Input, OnInit } from "@angular/core";
import { GridData } from "../../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../../_core/domains/enums/data.type";
import { ViewUserComponent } from "../view.user/view.user.component";
import { ResultApi } from "../../../../../_core/domains/data/result.api";
import { ToastrHelper } from "../../../../../_core/helpers/toastr.helper";
import { PagingData } from "../../../../../_core/domains/data/paging.data";
import { ActionData } from "../../../../../_core/domains/data/action.data";
import { UserEntity } from "../../../../../_core/domains/entities/user.entity";
import { ModalSizeType } from "../../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../../_core/components/grid/grid.component";

@Component({
    selector: 'choice-user',
    templateUrl: '../../../../../_core/components/grid/grid.component.html',
})
export class ChoiceUserComponent extends GridComponent implements OnInit {
    id: number;
    type: string;
    autoSave: boolean;
    navigation: boolean;
    ignoreIds: number[];
    @Input() params: any;
    selectedItems: UserEntity[] = [];
    choiceComplete: (ids?: any[]) => void;
    obj: GridData = {
        Exports: [],
        Imports: [],
        Filters: [],
        Actions: [],
        Features: [
            ActionData.addNew(() => { this.openNewTabAddNewUser(); }),
            ActionData.reload(() => { this.loadItems(); }),
        ],
        IsPopup: true,
        Title: 'Choice',
        Checkable: true,
        UpdatedBy: false,
        Reference: UserEntity,
        HideCustomFilter: true,
    };

    roleService: RoleService;
    userService: UserService;

    constructor() {
        super();
        this.roleService = AppInjector.get(RoleService);
        this.userService = AppInjector.get(UserService);
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            {
                Property: 'FullName', Type: DataType.String,
                Click: (item: any) => {
                    this.view(item);
                }
            },
            { Property: 'Phone', Type: DataType.String },
            { Property: 'Email', Type: DataType.String },
        ];
    }

    async ngOnInit() {
        this.type = this.params && this.params['type'];
        this.id = this.params && this.params['id'] || 0;
        this.autoSave = this.params && this.params['autoSave'];
        this.ignoreIds = this.params && this.params['ignoreIds'];
        this.navigation = this.params && this.params['navigation'];
        this.choiceComplete = this.params && this.params['choiceComplete'];
        if (this.type) {
            switch (this.type.toLowerCase()) {
                case 'role': {
                    this.obj.Url = '/admin/user/IgnoreItems/role/' + this.id;
                } break;
            }
        }
        this.obj.IgnoreIds = this.ignoreIds;
        if (!this.itemData.Paging)
            this.itemData.Paging = new PagingData();
        this.itemData.Paging.Size = 10000;
        await this.render(this.obj);
    }

    view(item: any) {
        this.dialogService.WapperAsync({
            title: 'Account',
            cancelText: 'Close',
            object: ViewUserComponent,
            objectExtra: { id: item.Id },
            size: ModalSizeType.FullScreen,
        }, null, null, null, () => {
            if (this.navigation) this.popupChoiceUser();
        });
    }

    checkAllChange() {
        if (this.checkAll) {
            this.items.forEach((item: UserEntity) => {
                item.Checked = true;
                if (item.Checked) {
                    let exists = this.selectedItems.findIndex(c => c.Id == item.Id) >= 0;
                    if (!exists) this.selectedItems.push(item);
                }
            });
        } else this.selectedItems = [];
    }

    popupChoiceUser() {
        setTimeout(() => {
            this.dialogService.WapperAsync({
                title: 'Accounts',
                cancelText: 'Close',
                objectExtra: this.params,
                object: ChoiceUserComponent,
                size: ModalSizeType.ExtraLarge,
            });
        }, 100);
    }

    openNewTabAddNewUser() {
        let newRelativeUrl = this.router.createUrlTree(['/admin/user/add']);
        let baseUrl = window.location.href.replace(this.router.url, '');
        window.open(baseUrl + newRelativeUrl, '_blank');
    }

    checkChange(evt: any, item: UserEntity) {
        item.Checked = evt.target.checked;
        if (item.Checked) {
            let exists = this.selectedItems.findIndex(c => c.Id == item.Id) >= 0;
            if (!exists) this.selectedItems.push(item);
        } else this.selectedItems = this.selectedItems.filter(c => c.Id != item.Id);
    }

    public async confirm(): Promise<boolean> {
        if (this.id) {
            if (this.autoSave) {
                let type: string = this.params && this.params['type'];
                switch (type) {
                    case 'role': return await this.confirmByRole(this.id);
                }
            } else {
                if (this.choiceComplete)
                    this.choiceComplete(this.selectedItems);
                return true;
            }
        } else {
            if (this.choiceComplete) {
                this.choiceComplete(this.selectedItems);
                return true;
            }
        }
        return false;
    }

    private async confirmByRole(roleId: number) {
        let ids = this.selectedItems && this.selectedItems.map(c => c.Id);
        if (ids && ids.length > 0) {
            return await this.roleService.addUsers(roleId, ids).then((result: ResultApi) => {
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
        } return false;
    }
}