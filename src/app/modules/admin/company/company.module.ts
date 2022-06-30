import { RouterModule } from "@angular/router";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ActionData } from "../../../_core/domains/data/action.data";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { EditCompanyComponent } from "./edit.company/edit.company.component";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { CompanyEntity } from "../../../_core/domains/entities/company.entity";
import { ActionType } from "src/app/_core/domains/enums/action.type";
import { MethodType } from "src/app/_core/domains/enums/method.type";
import { ResultApi } from "src/app/_core/domains/data/result.api";
import { ToastrHelper } from "src/app/_core/helpers/toastr.helper";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class CompanyComponent extends GridComponent {
    obj: GridData = {
        UpdatedBy: false,
        Reference: CompanyEntity,
        Size: ModalSizeType.Small,
        Actions: [
            ActionData.view((item: any) => this.view(item)),
            {
                name: 'Approve',
                icon: 'la la-check',
                className: 'btn btn-primary',
                systemName: ActionType.Approve,
                click: (item: any) => {
                    this.dialogService.ConfirmAsync('Do you want approve company: <b>' + item.Name + '</b>', async () => {
                        let name = item.Name,
                            userId = item.UserId;
                        await this.service.callApi('user', 'approve/' + userId, null, MethodType.Post).then((result: ResultApi) => {
                            if (ResultApi.IsSuccess(result)) {
                                ToastrHelper.Success('Approve company: <b>' + name + '</b> success');
                                this.loadItems();
                            } else ToastrHelper.ErrorResult(result);
                        });
                    })
                }
            }
        ],
        Features: [
            ActionData.addNew(() => this.addNew()),
            ActionData.reload(() => this.loadItems()),
        ]
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            { Property: 'Name', Type: DataType.String },
            { Property: 'Phone', Type: DataType.Number },
            { Property: 'Email', Type: DataType.Number },
            { Property: 'Leader', Type: DataType.String },
            { Property: 'Address', Type: DataType.String },
        ];
        if (this.authen.management) {
            this.properties.splice(1, 0, { Property: 'Account', Type: DataType.String });
        }
        this.render(this.obj);
    }

    addNew() {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            confirmText: 'Create',
            title: 'Create Company',
            size: ModalSizeType.Large,
            object: EditCompanyComponent,
        }, async () => {
            await this.loadItems();
        });
    }

    edit(item: CompanyEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            confirmText: 'Save',
            title: 'Edit Company',
            size: ModalSizeType.Small,
            object: EditCompanyComponent,
            objectExtra: {
                id: item.Id,
            }
        }, async () => {
            await this.loadItems();
        });
    }

    view(item: CompanyEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            title: 'View Company',
            size: ModalSizeType.Small,
            object: EditCompanyComponent,
            objectExtra: {
                id: item.Id,
                viewer: true,
            }
        });
    }
}

@NgModule({
    declarations: [
        CompanyComponent,
        EditCompanyComponent
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: CompanyComponent, pathMatch: 'full', data: { state: 'company' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class CompanyModule { }