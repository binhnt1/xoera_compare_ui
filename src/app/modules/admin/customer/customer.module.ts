import { RouterModule } from "@angular/router";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { AppConfig } from "../../../_core/helpers/app.config";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ActionData } from "../../../_core/domains/data/action.data";
import { StatusType } from "../../../_core/domains/enums/status.type";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { UtilityExHelper } from "../../../_core/helpers/utility.helper";
import { UserEntity } from "../../../_core/domains/entities/user.entity";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { EditCustomerComponent } from "./edit.customer/edit.customer.component";
import { ModalSizeType } from "src/app/_core/domains/enums/modal.size.type";


@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class CustomerComponent extends GridComponent {
    obj: GridData = {
        Filters: [],
        Exports: [],
        Imports: [],
        Actions: [],
        Features: [
            ActionData.reload(() => this.loadItems()),
            ActionData.addNew(() => {
                this.dialogService.WapperAsync({
                    cancelText: 'Close',
                    confirmText: 'Create',
                    title: 'Create customer',
                    size: ModalSizeType.Large,
                    object: EditCustomerComponent,
                }, async () => {
                    this.loadItems();
                });
            })
        ],
        Title: 'Customers',
        Reference: UserEntity,
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            { Property: 'FullName', Type: DataType.String },
            { Property: 'Phone', Type: DataType.String },
            { Property: 'Email', Type: DataType.String },
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
        this.obj.Url = '/admin/user/items?type=-1';
        this.render(this.obj);
    }
}

@NgModule({
    declarations: [
        CustomerComponent,
        EditCustomerComponent
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: CustomerComponent, pathMatch: 'full', data: { state: 'account' }, canActivate: [AdminAuthGuard] },
        ])
    ],
})
export class CustomerModule { }