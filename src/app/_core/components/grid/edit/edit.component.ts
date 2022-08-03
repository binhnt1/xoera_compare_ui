import { GridComponent } from "../grid.component";
import { ResultApi } from "../../../../_core/domains/data/result.api";
import { ToastrHelper } from "../../../../_core/helpers/toastr.helper";
import { ActionType } from "../../../../_core/domains/enums/action.type";
import { BaseEntity } from "../../../../_core/domains/entities/base.entity";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { NavigationStateData } from "../../../../_core/domains/data/navigation.state";
import { ChoiceUserComponent } from "../../../../modules/admin/sercurity/user/choice.user/choice.user.component";
import { ViewChoiceUserComponent } from "../../../../modules/admin/sercurity/user/choice.user/view.choice.user.component";

export abstract class GridEditComponent extends GridComponent {
    addNew() {
        let obj: NavigationStateData = {
                prevData: this.itemData,
                prevUrl: '/admin/' + this.obj.ReferenceName,
            };
        this.router.navigate(['/admin/' + this.obj.ReferenceName + '/add'], { state: { params: JSON.stringify(obj) } });
    }

    trash(item: any) {
        if (this.obj && this.obj.Reference) {
            this.dialogService.ConfirmAsync('Are you want <b>' + (item.IsDelete ? 'restore' : 'delete') + '</b> this record?', async () => {
                await this.service.trashVerify(this.obj.ReferenceName, item.Id).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success((item.IsDelete ? 'Restore ' : 'Delete ') + this.obj.Title.toLowerCase() + ' success');
                        this.loadItems();
                    } else ToastrHelper.ErrorResult(result);
                });
            });
        }
    }

    view(item: BaseEntity) {
        let obj: NavigationStateData = {
                id: item.Id,
                prevData: this.itemData,
                prevUrl: '/admin/' + this.obj.ReferenceName,
            };
        this.router.navigate(['/admin/' + this.obj.ReferenceName + '/view'], { state: { params: JSON.stringify(obj) } });
    }

    edit(item: BaseEntity) {
        let obj: NavigationStateData = {
                id: item.Id,
                prevData: this.itemData,
                prevUrl: '/admin/' + this.obj.ReferenceName,
            };
        this.router.navigate(['/admin/' + this.obj.ReferenceName + '/edit'], { state: { params: JSON.stringify(obj) } });
    }

    popupChoiceUser(item: BaseEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            title: 'Add account',
            confirmText: 'Choice',
            object: ChoiceUserComponent,
            size: ModalSizeType.ExtraLarge,
            objectExtra: {
                id: item.Id,
                autoSave: true,
                navigation: true,
                type: this.obj.ReferenceName,
            },
        }, async () => {
            this.loadItems();
        });
    }

    popupViewChoiceUser(item: BaseEntity) {
        let addUser = this.authen.permissionAllow(this.obj.ReferenceName, ActionType.EditMember),
            deleteUser = this.authen.permissionAllow(this.obj.ReferenceName, ActionType.EditMember);
        this.dialogService.WapperAsync({
            title: 'Accounts',
            cancelText: 'Close',
            confirmText: 'Save',
            size: ModalSizeType.ExtraLarge,
            object: ViewChoiceUserComponent,
            objectExtra: {
                id: item.Id,
                autoSave: true,
                type: this.obj.ReferenceName,
                addUser: addUser,
                navigation: true,
                deleteUser: deleteUser,
                choiceComplete: () => {
                    this.loadItems();
                }
            },
        }, async () => {
            this.loadItems();
        });
    }
}