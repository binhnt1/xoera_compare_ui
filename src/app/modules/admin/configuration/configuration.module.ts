import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { UtilityModule } from "../../utility.module";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { EditConfigurationComponent } from "./edit.configuration.component";

@NgModule({
    declarations: [
        EditConfigurationComponent
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: EditConfigurationComponent, pathMatch: 'full', data: { state: 'configuration'}, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class ConfigurationModule { }