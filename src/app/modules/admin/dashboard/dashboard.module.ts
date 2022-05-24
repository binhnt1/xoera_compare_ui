import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UtilityModule } from '../../utility.module';
import { DashboardComponent } from './dashboard.component';
import { AdminAuthGuard } from '../../../_core/guards/admin.auth.guard';

@NgModule({
    declarations: [
        DashboardComponent
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: DashboardComponent, pathMatch: 'full', data: { state: 'dashboard'}, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class DashboardModule { }
