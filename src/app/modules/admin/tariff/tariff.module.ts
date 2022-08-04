import { RouterModule } from "@angular/router";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { EditTariffComponent } from "./edit.tariff/edit.tariff.component";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { TariffEntity } from "../../../_core/domains/entities/tariff.entity";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { NavigationStateData } from "../../../_core/domains/data/navigation.state";

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
        let obj: NavigationStateData = {
            prevData: this.itemData,
            prevUrl: '/admin/tariff',
        };
        this.router.navigate(['/admin/tariff/add'], { state: { params: JSON.stringify(obj) } });
    }

    edit(item: TariffEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevData: this.itemData,
            prevUrl: '/admin/tariff',
        };
        this.router.navigate(['/admin/tariff/edit'], { state: { params: JSON.stringify(obj) } });
    }

    view(item: TariffEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            viewer: true,
            prevData: this.itemData,
            prevUrl: '/admin/tariff',
        };
        this.router.navigate(['/admin/tariff/view'], { state: { params: JSON.stringify(obj) } });
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
            { path: 'add', component: EditTariffComponent, pathMatch: 'full', data: { state: 'add_tariff'}, canActivate: [AdminAuthGuard] },
            { path: 'edit', component: EditTariffComponent, pathMatch: 'full', data: { state: 'edit_tariff'}, canActivate: [AdminAuthGuard] },
            { path: 'view', component: EditTariffComponent, pathMatch: 'full', data: { state: 'view_tariff'}, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class TariffModule { }