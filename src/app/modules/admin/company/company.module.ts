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
        ],
        Features: [
            ActionData.reload(() => this.loadItems())
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