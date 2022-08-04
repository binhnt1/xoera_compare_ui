import { RouterModule } from "@angular/router";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { UserType } from "../../../_core/domains/enums/user.type";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { VehicleTypeMappingEntity } from "../../../_core/domains/entities/vehicle.type.mapping.entity";
import { EditVehicleTypeMappingComponent } from "./edit.vehicle.type.mapping/edit.vehicle.type.mapping.component";
import { NavigationStateData } from "src/app/_core/domains/data/navigation.state";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class VehicleTypeMappingComponent extends GridComponent {
    obj: GridData = {
        UpdatedBy: false,
        Size: ModalSizeType.FullScreen,
        Reference: VehicleTypeMappingEntity,
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            { Property: 'Name', Type: DataType.String },
            { Property: 'Icon', Type: DataType.Image },
            { Property: 'Vehicle', Type: DataType.String },
        ];
        if (this.authen.management) {
            this.properties.splice(1, 0, { Property: 'Account', Type: DataType.String });
        }
        this.render(this.obj);
    }

    addNew() {
        let obj: NavigationStateData = {
            prevData: this.itemData,
            prevUrl: '/admin/vehicletypemapping',
        };
        this.router.navigate(['/admin/vehicletypemapping/add'], { state: { params: JSON.stringify(obj) } });
    }

    edit(item: VehicleTypeMappingEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevData: this.itemData,
            prevUrl: '/admin/vehicletypemapping',
        };
        this.router.navigate(['/admin/vehicletypemapping/edit'], { state: { params: JSON.stringify(obj) } });
    }

    view(item: VehicleTypeMappingEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            viewer: true,
            prevData: this.itemData,
            prevUrl: '/admin/vehicletypemapping',
        };
        this.router.navigate(['/admin/vehicletypemapping/view'], { state: { params: JSON.stringify(obj) } });
    }
}

@NgModule({
    declarations: [
        VehicleTypeMappingComponent,
        EditVehicleTypeMappingComponent
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: VehicleTypeMappingComponent, pathMatch: 'full', data: { state: 'vehicletypemapping' }, canActivate: [AdminAuthGuard] },
            { path: 'add', component: EditVehicleTypeMappingComponent, pathMatch: 'full', data: { state: 'add_vehicletypemapping'}, canActivate: [AdminAuthGuard] },
            { path: 'edit', component: EditVehicleTypeMappingComponent, pathMatch: 'full', data: { state: 'edit_vehicletypemapping'}, canActivate: [AdminAuthGuard] },
            { path: 'view', component: EditVehicleTypeMappingComponent, pathMatch: 'full', data: { state: 'view_vehicletypemapping'}, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class VehicleTypeMappingModule { }