import { RouterModule } from "@angular/router";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { NavigationStateData } from "../../../_core/domains/data/navigation.state";
import { VehicleTypeEntity } from "../../../_core/domains/entities/vehicle.type.entity";
import { EditVehicleTypeComponent } from "./edit.vehicle.type/edit.vehicle.type.component";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class VehicleTypeComponent extends GridComponent {
    obj: GridData = {
        UpdatedBy: false,
        Size: ModalSizeType.FullScreen,
        Reference: VehicleTypeEntity,
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            {
                Property: 'TypeName', Type: DataType.String,
                Format: (item: any) => {
                    let text = item.TypeName || '';
                    if (item.ColourCode) text += '<p>Colour Code: ' + item.ColourCode + '</p>';
                    return text;
                }
            },
            { Property: 'WebIcon', Type: DataType.Image },
            { Property: 'DesktopIcon', Type: DataType.Image },
            { Property: 'ServiceType', Type: DataType.String },
            {
                Property: 'NoOfLuggeges', Title: 'Luggeges/Passengers', Type: DataType.String,
                Format: (item: any) => {
                    let text = '';
                    if (item.NoOfLuggeges) text += '<p>Luggeges: ' + item.NoOfLuggeges + '</p>';
                    if (item.NoOfHandBags) text += '<p>HandBags: ' + item.NoOfHandBags + '</p>';
                    if (item.NoOfPassengers) text += '<p>Passengers: ' + item.NoOfPassengers + '</p>';
                    return text;
                }
            },
            {
                Property: 'MaxNoOfLuggages', Title: 'Max Luggeges/HandBags', Type: DataType.String,
                Format: (item: any) => {
                    let text = '';
                    if (item.MaxNoOfLuggages) text += '<p>Luggeges: ' + item.MaxNoOfLuggages + '</p>';
                    if (item.MaxNoOfHandBags) text += '<p>HandBags: ' + item.MaxNoOfHandBags + '</p>';
                    return text;
                }
            },
            { Property: 'PriceModifyAmount', Type: DataType.Number },
        ];
        this.render(this.obj);
    }

    addNew() {
        let obj: NavigationStateData = {
            prevData: this.itemData,
            prevUrl: '/admin/vehicletype',
        };
        this.router.navigate(['/admin/vehicletype/add'], { state: { params: JSON.stringify(obj) } });
    }

    edit(item: VehicleTypeEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevData: this.itemData,
            prevUrl: '/admin/vehicletype',
        };
        this.router.navigate(['/admin/vehicletype/edit'], { state: { params: JSON.stringify(obj) } });
    }

    view(item: VehicleTypeEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            viewer: true,
            prevData: this.itemData,
            prevUrl: '/admin/vehicletype',
        };
        this.router.navigate(['/admin/vehicletype/view'], { state: { params: JSON.stringify(obj) } });
    }
}

@NgModule({
    declarations: [
        VehicleTypeComponent,
        EditVehicleTypeComponent
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: VehicleTypeComponent, pathMatch: 'full', data: { state: 'vehicletype' }, canActivate: [AdminAuthGuard] },
            { path: 'add', component: EditVehicleTypeComponent, pathMatch: 'full', data: { state: 'add_vehicletype' }, canActivate: [AdminAuthGuard] },
            { path: 'edit', component: EditVehicleTypeComponent, pathMatch: 'full', data: { state: 'edit_vehicletype' }, canActivate: [AdminAuthGuard] },
            { path: 'view', component: EditVehicleTypeComponent, pathMatch: 'full', data: { state: 'view_vehicletype' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class VehicleTypeModule { }