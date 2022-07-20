import { UserService } from './user.service';
import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../../utility.module';
import { AdminShareModule } from '../../admin.share.module';
import { AppConfig } from '../../../../_core/helpers/app.config';
import { LockUserComponent } from './lock.user/lock.user.component';
import { EditUserComponent } from './edit.user/edit.user.component';
import { ViewUserComponent } from './view.user/view.user.component';
import { GridData } from '../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { ActionType } from '../../../../_core/domains/enums/action.type';
import { StatusType } from '../../../../_core/domains/enums/status.type';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { AdminAuthGuard } from "../../../../_core/guards/admin.auth.guard";
import { UserEntity } from '../../../../_core/domains/entities/user.entity';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../../_core/components/grid/grid.component';
import { NavigationStateData } from '../../../../_core/domains/data/navigation.state';
import { UserType } from 'src/app/_core/domains/enums/user.type';

@Component({
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class UserComponent extends GridComponent {
    obj: GridData = {
        Title: 'Users',
        Reference: UserEntity,
        Filters: [],
        Exports: [],
        Imports: [],
        Actions: [
            ActionData.edit((item: UserEntity) => {
                this.edit(item);
            }),
            ActionData.view((item: any) => {
                this.view(item);
            })
        ],
        MoreActions: [
            {
                icon: 'la la-key',
                name: ActionType.ResetPassword,
                systemName: ActionType.ResetPassword,
                hidden: ((item: any) => {
                    return item.LockStatus;
                }),
                click: ((item: any) => {
                    this.dialogService.ConfirmAsync('Reset password for account <b>' + item.Name + '</b>', async () => {
                        await this.userService.adminResetPassword(item.Id).then((result: ResultApi) => {
                            if (ResultApi.IsSuccess(result)) {
                                if (result.Object) ToastrHelper.Success('The system has sent an email to set up a new password for account');
                                else ToastrHelper.Error('Can\'t send email for account');
                            } else ToastrHelper.ErrorResult(result);
                        });
                    });
                })
            },
            {
                icon: 'la la-unlock',
                name: ActionType.UnLock,
                systemName: ActionType.UnLock,
                hidden: ((item: any) => {
                    return !item.LockStatus;
                }),
                click: ((item: any) => {
                    this.dialogService.ConfirmAsync('Confirm unlock for the account <b>' + item.Name + '</b>', async () => {
                        await this.userService.unLockUser(item.Id).then((result: ResultApi) => {
                            if (ResultApi.IsSuccess(result)) {
                                ToastrHelper.Success('UnLock account success');
                                this.loadItems();
                            } else ToastrHelper.ErrorResult(result);
                        });
                    });
                })
            },
            {
                icon: 'la la-lock',
                name: ActionType.Lock,
                systemName: ActionType.Lock,
                hidden: ((item: any) => {
                    return item.LockStatus;
                }),
                click: ((item: UserEntity) => {
                    this.dialogService.WapperAsync({
                        cancelText: 'Close',
                        title: 'Lock Account',
                        confirmText: 'Confirm',
                        object: LockUserComponent,
                        size: ModalSizeType.Large,
                        objectExtra: { id: item.Id },
                    }, async () => {
                        this.loadItems();
                    });
                })
            },
        ],
    };

    constructor(public userService: UserService) {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            {
                Property: 'FullName', Type: DataType.String,
                Format: ((item: any) => {
                    item.Name = item.FullName;
                    let text = '<a routerLink="view">' + UtilityExHelper.escapeHtml(item.FullName) + '</a>';
                    if (item.Phone) text += '<p><i class=\'la la-phone\'></i> ' + item.Phone + '</p>';
                    if (item.Email) text += '<p><i class=\'la la-inbox\'></i> ' + item.Email + '</p>';
                    return text;
                })
            },
            { Property: 'Team', Type: DataType.String },
            { Property: 'Role', Type: DataType.String },
            {
                Property: 'Locked', Type: DataType.String, Align: 'center',
                Format: ((item: any) => {
                    item.LockStatus = item.Locked ? true : false;
                    let text = item.Locked ? 'Locked' : 'Active',
                        status = item.Locked ? StatusType.Warning : StatusType.Success;
                    return UtilityExHelper.formatText(text, status);
                })
            },
            {
                Property: 'Avatar', Type: DataType.Image, Align: 'center',
                Format: ((item: any) => {
                    return !item.Avatar || item.Avatar.indexOf('http') >= 0
                        ? item.Avatar
                        : AppConfig.ApiUrl.replace('/api', '') + '/' + item.Avatar;
                })
            },
            { Property: 'LastLogin', Type: DataType.DateTime, Align: 'center' },
        ];
        if (this.authen.account.UserType == UserType.Normal) {
            this.obj.Url = '/admin/user/items?type=' + UserType.Normal;
        }
        this.render(this.obj);
    }

    addNew() {
        let obj: NavigationStateData = {
            prevUrl: '/admin/user',
            prevData: this.itemData,
        };
        this.router.navigate(['/admin/user/add'], { state: { params: JSON.stringify(obj) } });
    }

    edit(item: UserEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevUrl: '/admin/user',
            prevData: this.itemData,
        };
        this.router.navigate(['/admin/user/edit'], { state: { params: JSON.stringify(obj) } });
    }

    view(item: UserEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevUrl: '/admin/user',
            prevData: this.itemData,
        };
        this.router.navigate(['/admin/user/view'], { state: { params: JSON.stringify(obj) } });
    }
}

@NgModule({
    declarations: [
        UserComponent,
        LockUserComponent,
        EditUserComponent,
    ],
    imports: [
        AdminShareModule,
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: UserComponent, pathMatch: 'full', data: { state: 'user' }, canActivate: [AdminAuthGuard] },
            { path: 'add', component: EditUserComponent, pathMatch: 'full', data: { state: 'add_user' }, canActivate: [AdminAuthGuard] },
            { path: 'edit', component: EditUserComponent, pathMatch: 'full', data: { state: 'edit_user' }, canActivate: [AdminAuthGuard] },
            { path: 'view', component: ViewUserComponent, pathMatch: 'full', data: { state: 'view_user' }, canActivate: [AdminAuthGuard] },
        ])
    ],
    providers: [UserService]
})
export class UserModule { }