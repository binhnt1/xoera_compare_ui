import { RouterModule } from "@angular/router";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { EditZoneComponent } from "./edit.zone/edit.zone.component";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { UtilityExHelper } from "../../../_core/helpers/utility.helper";
import { ZoneEntity } from "../../../_core/domains/entities/zone.entity";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { NavigationStateData } from "../../../_core/domains/data/navigation.state";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class ZoneComponent extends GridComponent {
    obj: GridData = {
        UpdatedBy: false,
        Size: ModalSizeType.FullScreen,
        Reference: ZoneEntity,
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            {
                Property: 'ZoneName', Type: DataType.String,
                Format: (item: any) => {
                    let text = item.ZoneName || '';
                    if (item.ZoneType) text += '<p>Type: ' + item.ZoneType + '</p>';
                    return text;
                }
            },
            {
                Property: 'Area', Title: 'Area/Region', Type: DataType.String,
                Format: (item: any) => {
                    let text = item.Area || '';
                    if (item.Region) text += '<p>Region: ' + item.Region + '</p>';
                    return text;
                }
            },
            {
                Property: 'Lat', Title: 'Lat/Lng', Type: DataType.String,
                Format: (item: any) => {
                    let text = '';
                    if (item.Lat) text += '<p>Lat: ' + item.Lat + '</p>';
                    if (item.Lng) text += '<p>Lng: ' + item.Lng + '</p>';
                    return text;
                }
            },
            { Property: 'LeadTime', Type: DataType.Number },
            { Property: 'Radius', Type: DataType.Number },
            { Property: 'PickupCharge', Type: DataType.Number },
            {
                Property: 'ParkingPickup', Title: 'Parking', Type: DataType.String,
                Format: (item: any) => {
                    let text = '';
                    if (item.ParkingPickup) text += '<p>Pickup: ' + item.ParkingPickup + '</p>';
                    if (item.ParkingDropoff) text += '<p>Dropoff: ' + item.ParkingDropoff + '</p>';
                    return text;
                }
            },
            {
                Property: 'MinDropoffDistance', Title: 'Distance', Type: DataType.String,
                Format: (item: any) => {
                    let text = '';
                    if (item.MinDropoffDistance) text += '<p>Min: ' + item.MinDropoffDistance + '</p>';
                    if (item.MaxDropoffDistance) text += '<p>Max: ' + item.MaxDropoffDistance + '</p>';
                    return text;
                }
            },
            {
                Property: 'FreezeStarts', Title: 'Freeze', Type: DataType.String,
                Format: (item: any) => {
                    let text = '';
                    if (item.FreezeStarts) text += '<p>Starts: ' + UtilityExHelper.dateTimeString(item.FreezeStarts) + '</p>';
                    if (item.FreezeExpires) text += '<p>Expires: ' + UtilityExHelper.dateTimeString(item.FreezeExpires) + '</p>';
                    return text;
                }
            },
        ];
        this.render(this.obj);
    }

    addNew() {
        let obj: NavigationStateData = {
            prevData: this.itemData,
            prevUrl: '/admin/zone',
        };
        this.router.navigate(['/admin/zone/add'], { state: { params: JSON.stringify(obj) } });
    }

    edit(item: ZoneEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevData: this.itemData,
            prevUrl: '/admin/zone',
        };
        this.router.navigate(['/admin/zone/edit'], { state: { params: JSON.stringify(obj) } });
    }

    view(item: ZoneEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            viewer: true,
            prevData: this.itemData,
            prevUrl: '/admin/zone',
        };
        this.router.navigate(['/admin/zone/view'], { state: { params: JSON.stringify(obj) } });
    }
}

@NgModule({
    declarations: [
        ZoneComponent,
        EditZoneComponent
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: ZoneComponent, pathMatch: 'full', data: { state: 'zone' }, canActivate: [AdminAuthGuard] },
            { path: 'add', component: EditZoneComponent, pathMatch: 'full', data: { state: 'add_zone' }, canActivate: [AdminAuthGuard] },
            { path: 'edit', component: EditZoneComponent, pathMatch: 'full', data: { state: 'edit_zone' }, canActivate: [AdminAuthGuard] },
            { path: 'view', component: EditZoneComponent, pathMatch: 'full', data: { state: 'view_zone' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class ZoneModule { }