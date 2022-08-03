import { RouterModule } from "@angular/router";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { UserType } from "../../../_core/domains/enums/user.type";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { EditTariffComponent } from "./edit.tariff/edit.tariff.component";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { TariffEntity } from "../../../_core/domains/entities/tariff.entity";
import { GridComponent } from "../../../_core/components/grid/grid.component";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class TariffComponent extends GridComponent {
    obj: GridData = {
        UpdatedBy: false,
        Reference: TariffEntity,
        Size: ModalSizeType.FullScreen,
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            { Property: 'Name', Type: DataType.String },
            { Property: 'Day', Type: DataType.Number },
            { Property: 'StartTime', Type: DataType.String },
            { Property: 'EndTime', Type: DataType.String },
            { Property: 'Rule', Type: DataType.String },
            { Property: 'PriceModifyAmount', Type: DataType.Number },
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
            title: 'Create Tariff',
            size: ModalSizeType.Small,
            object: EditTariffComponent,
        }, async () => {
            await this.loadItems();
        });
    }

    edit(item: TariffEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            confirmText: 'Save',
            title: 'Edit Tariff',
            size: ModalSizeType.Small,
            object: EditTariffComponent,
            objectExtra: {
                id: item.Id,
            }
        }, async () => {
            await this.loadItems();
        });
    }

    view(item: TariffEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            title: 'View Tariff',
            size: ModalSizeType.Small,
            object: EditTariffComponent,
            objectExtra: {
                id: item.Id,
                viewer: true,
            }
        });
    }
}

@NgModule({
    declarations: [
        TariffComponent,
        EditTariffComponent
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: TariffComponent, pathMatch: 'full', data: { state: 'tariff' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class TariffModule { }