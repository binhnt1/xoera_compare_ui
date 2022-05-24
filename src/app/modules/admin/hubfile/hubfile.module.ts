import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { UtilityModule } from "../../utility.module";
import { HubFileComponent } from "./hubfile.component";
import { AdminShareModule } from "../admin.share.module";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { DiagramComponent } from "./components/diagram/diagram.component";
import { GridHubFileComponent } from "./components/grid.hubfile.component";
import { TestHubFileComponent } from "./test.hubfile/test.hubfile.component";
import { UploadFileComponent } from "./components/upload.file/upload.file.component";
import { GridHubFileSummaryComponent } from "./components/grid.hubfile.summary.component";
import { GridHubFileConfirmReportComponent } from "./components/grid.hubfile.report.component";

@NgModule({
    declarations: [
        DiagramComponent,
        HubFileComponent,
        UploadFileComponent,
        GridHubFileComponent,
        TestHubFileComponent,
        GridHubFileSummaryComponent,
        GridHubFileConfirmReportComponent,
    ],
    imports: [
        UtilityModule,
        AdminShareModule,
        RouterModule.forChild([
            { path: '', component: HubFileComponent, pathMatch: 'full', data: { state: 'hubfile'}, canActivate: [AdminAuthGuard] },
            { path: 'test', component: TestHubFileComponent, pathMatch: 'full', data: { state: 'test_hubfile'}, canActivate: [AdminAuthGuard] },
            { path: 'confirmreports', component: GridHubFileConfirmReportComponent, pathMatch: 'full', data: { state: 'confirm_reports'}, canActivate: [AdminAuthGuard] },
            { path: 'lostsitereports', component: GridHubFileConfirmReportComponent, pathMatch: 'full', data: { state: 'lost_site_reports'}, canActivate: [AdminAuthGuard] },
            { path: 'exceptionreports', component: GridHubFileConfirmReportComponent, pathMatch: 'full', data: { state: 'exception_reports'}, canActivate: [AdminAuthGuard] },
            { path: 'rejectionreports', component: GridHubFileConfirmReportComponent, pathMatch: 'full', data: { state: 'rejection_reports'}, canActivate: [AdminAuthGuard] },
            { path: 'allrejectionreports', component: GridHubFileConfirmReportComponent, pathMatch: 'full', data: { state: 'allrejectionreports_reports'}, canActivate: [AdminAuthGuard] },
            { path: 'dailyobjectinonreports', component: GridHubFileConfirmReportComponent, pathMatch: 'full', data: { state: 'daily_objectinon_reports'}, canActivate: [AdminAuthGuard] },
            { path: 'dailygainedsitereports', component: GridHubFileConfirmReportComponent, pathMatch: 'full', data: { state: 'daily_gained_site_reports'}, canActivate: [AdminAuthGuard] },
            { path: 'lostnotificationreports', component: GridHubFileConfirmReportComponent, pathMatch: 'full', data: { state: 'lost_notification_reports'}, canActivate: [AdminAuthGuard] },
            { path: 'dailyconfirmationreports', component: GridHubFileConfirmReportComponent, pathMatch: 'full', data: { state: 'daily_confirmation_reports'}, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class HubFileModule { }