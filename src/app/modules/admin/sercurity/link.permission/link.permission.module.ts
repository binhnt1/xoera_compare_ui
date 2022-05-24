import { RouterModule } from "@angular/router";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../../utility.module";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { AdminAuthGuard } from "../../../../_core/guards/admin.auth.guard";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { LinkPermissionEntity } from "../../../../_core/domains/entities/link.permission.entity";

@Component({
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class LinkPermissionComponent extends GridComponent {
    obj: GridData = {
        Size: ModalSizeType.Large,
        Reference: LinkPermissionEntity
    };

    constructor() {
        super();
        this.render(this.obj);
    }
}

@NgModule({
    declarations: [LinkPermissionComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: LinkPermissionComponent, pathMatch: 'full', data: { state: 'link_permission'}, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class LinkPermissionModule { }