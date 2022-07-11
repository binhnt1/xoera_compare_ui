import { RouterModule } from "@angular/router";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ResultApi } from "../../../_core/domains/data/result.api";
import { ToastrHelper } from "../../../_core/helpers/toastr.helper";
import { ActionData } from "../../../_core/domains/data/action.data";
import { ActionType } from "../../../_core/domains/enums/action.type";
import { MethodType } from "../../../_core/domains/enums/method.type";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { EditCompanyComponent } from "./edit.company/edit.company.component";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { CompanyEntity } from "../../../_core/domains/entities/company.entity";
import { NavigationStateData } from "../../../_core/domains/data/navigation.state";

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
            ActionData.edit((item: any) => this.edit(item)),
            {
                name: 'Approve',
                icon: 'la la-check',
                className: 'btn btn-success',
                systemName: ActionType.Approve,
                hidden: (item: any) => {
                    return item.Approved;
                },
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
            { Property: 'Address', Type: DataType.String },
            { Property: 'RegisterNumber', Type: DataType.String },
            { Property: 'Approved', Type: DataType.Boolean, Align: 'center' },
            { Property: 'IsPublic', Type: DataType.Boolean, Align: 'center' },
        ];
        if (this.authen.management) {
            this.properties.splice(1, 0, { Property: 'Account', Type: DataType.String });
        }
        this.render(this.obj);
    }

    addNew() {
        let obj: NavigationStateData = {
            prevData: this.itemData,
            prevUrl: '/admin/company',
        };
        this.router.navigate(['/admin/company/add'], { state: { params: JSON.stringify(obj) } });
    }

    edit(item: CompanyEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevData: this.itemData,
            prevUrl: '/admin/company',
        };
        this.router.navigate(['/admin/company/edit'], { state: { params: JSON.stringify(obj) } });
    }

    view(item: CompanyEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            viewer: true,
            prevData: this.itemData,
            prevUrl: '/admin/company',
        };
        this.router.navigate(['/admin/company/view'], { state: { params: JSON.stringify(obj) } });
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
            { path: 'add', component: EditCompanyComponent, pathMatch: 'full', data: { state: 'add_company'}, canActivate: [AdminAuthGuard] },
            { path: 'edit', component: EditCompanyComponent, pathMatch: 'full', data: { state: 'edit_company'}, canActivate: [AdminAuthGuard] },
            { path: 'view', component: EditCompanyComponent, pathMatch: 'full', data: { state: 'view_company'}, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class CompanyModule { }