import { RouterModule } from "@angular/router";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { EnumHelper } from "../../../_core/helpers/enum.helper";
import { GridData } from "../../../_core/domains/data/grid.data";
import { FlowType } from "../../../_core/domains/enums/flow.type";
import { DataType } from "../../../_core/domains/enums/data.type";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { NavigationStateData } from "../../../_core/domains/data/navigation.state";
import { HubFileValidationEntity } from "../../../_core/domains/entities/hubfile.validation.entity";
import { EditHubFileValidationComponent } from "./edit.hubfile.validation/edit.hubfile.validation.component";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class HubFileValidationComponent extends GridComponent {
    obj: GridData = {
        LastUpdatedBy: false,
        Title: 'Flow Definition',
        CustomFilters: ['Direction'],
        Size: ModalSizeType.ExtraLarge,
        Reference: HubFileValidationEntity,
    };

    constructor() {
        super();
        this.properties = [
            {
                Property: 'NodeId', Title: 'NodeId', Type: DataType.String,
                Format: ((item: any) => {
                    let type = EnumHelper.exportName(FlowType, item.Type);
                    return '<p><b>#' + item.NodeId + '</b></p>' +
                        '<p>Type: ' + type + '</p>' +
                        '<p>Flow: ' + item.Flow + '</p>';
                })
            },
            { Property: 'Direction', Type: DataType.DropDown, Align: 'center' },
            { Property: 'ParentNode', Type: DataType.String },
            {
                Property: 'PositiveResponse', Title: 'Positive/Negative', Type: DataType.String,
                Format: ((item: any) => {
                    if (item.PositiveResponse && item.NegativeResponse)
                        return '<p>' + item.PositiveResponse + ' / ' + item.NegativeResponse + '</p>';
                    return null;
                })
            },
            { Property: 'CancellationNode', Type: DataType.String },
            { Property: 'RestrictedNode', Type: DataType.String },
            { Property: 'AutoNextNode', Type: DataType.String },
            { Property: 'Condition', Type: DataType.String },
            {
                Property: 'MultipleAllowed', Type: DataType.String, Align: 'center',
                Format: ((item: any) => {
                    return '<p>' + item.MultipleAllowed + '</p>';
                })
            },
        ];
        this.render(this.obj);
    }

    addNew() {
        let obj: NavigationStateData = {
            prevData: this.itemData,
            prevUrl: '/admin/hubfilevalidation',
        };
        this.router.navigate(['/admin/hubfilevalidation/add'], { state: { params: JSON.stringify(obj) } });
    }

    edit(item: HubFileValidationEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevData: this.itemData,
            prevUrl: '/admin/hubfilevalidation',
        };
        this.router.navigate(['/admin/hubfilevalidation/edit'], { state: { params: JSON.stringify(obj) } });
    }

    view(item: HubFileValidationEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            viewer: true,
            prevData: this.itemData,
            prevUrl: '/admin/hubfilevalidation',
        };
        this.router.navigate(['/admin/hubfilevalidation/view'], { state: { params: JSON.stringify(obj) } });
    }
}

@NgModule({
    declarations: [
        HubFileValidationComponent,
        EditHubFileValidationComponent
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: HubFileValidationComponent, pathMatch: 'full', data: { state: 'hubfilevalidation' }, canActivate: [AdminAuthGuard] },
            { path: 'add', component: EditHubFileValidationComponent, pathMatch: 'full', data: { state: 'add_hubfilevalidation' }, canActivate: [AdminAuthGuard] },
            { path: 'edit', component: EditHubFileValidationComponent, pathMatch: 'full', data: { state: 'edit_hubfilevalidation' }, canActivate: [AdminAuthGuard] },
            { path: 'view', component: EditHubFileValidationComponent, pathMatch: 'full', data: { state: 'view_hubfilevalidation' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class HubFileValidationModule { }