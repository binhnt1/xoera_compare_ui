import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UtilityModule } from '../../utility.module';
import { DashboardComponent } from './dashboard.component';
import { PriceComponent } from './components/list.price.component';
import { LicenceComponent } from './components/list.licence.component';
import { AdminAuthGuard } from '../../../_core/guards/admin.auth.guard';
import { CompanyPartnerComponent } from './components/list.company.partner.component';
import { AddCompanyPartnerComponent } from './add.company.partner/add.company.partner.component';

@NgModule({
    declarations: [
        PriceComponent,
        LicenceComponent,
        DashboardComponent,
        CompanyPartnerComponent,
        AddCompanyPartnerComponent
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: DashboardComponent, pathMatch: 'full', data: { state: 'dashboard'}, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class DashboardModule { }
