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
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            confirmText: 'Create',
            size: ModalSizeType.Small,
            title: 'Create Vehicle Type Mapping',
            object: EditVehicleTypeMappingComponent,
        }, async () => {
            await this.loadItems();
        });
    }

    edit(item: VehicleTypeMappingEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            confirmText: 'Save',
            size: ModalSizeType.Small,
            title: 'Edit Vehicle Type Mapping',
            object: EditVehicleTypeMappingComponent,
            objectExtra: {
                id: item.Id,
            }
        }, async () => {
            await this.loadItems();
        });
    }

    view(item: VehicleTypeMappingEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            size: ModalSizeType.Small,
            title: 'View Vehicle Type Mapping',
            object: EditVehicleTypeMappingComponent,
            objectExtra: {
                id: item.Id,
                viewer: true,
            }
        });
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
        ])
    ]
})
export class VehicleTypeMappingModule { }