import { RouterModule } from "@angular/router";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../../utility.module";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { AdminAuthGuard } from "../../../../_core/guards/admin.auth.guard";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { PermissionEntity } from "../../../../_core/domains/entities/permission.entity";

@Component({
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class PermissionComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        Size: ModalSizeType.Large,
        Reference: PermissionEntity
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            { Property: 'Group', Type: DataType.String },
            { Property: 'Title', Type: DataType.String },
            { Property: 'Name', Type: DataType.String },
            { Property: 'Controller', Type: DataType.String },
            { Property: 'Action', Title: 'Action', Type: DataType.String },
        ];
        this.render(this.obj);
    }
}

@NgModule({
    declarations: [PermissionComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: PermissionComponent, pathMatch: 'full', data: { state: 'permission'}, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class PermissionModule { }