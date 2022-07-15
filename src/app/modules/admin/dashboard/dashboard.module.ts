import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UtilityModule } from '../../utility.module';
import { AdminShareModule } from '../admin.share.module';
import { DashboardComponent } from './dashboard.component';
import { ListPriceComponent } from './components/list.price.component';
import { AdminAuthGuard } from '../../../_core/guards/admin.auth.guard';
import { ListLicenceComponent } from './components/list.licence.component';
import { ListCompanyPartnerComponent } from './components/list.company.partner.component';
import { ListDispatchInvoiceComponent } from './components/list.dispatch.invoice.component';
import { AddCompanyPartnerComponent } from './add.company.partner/add.company.partner.component';

@NgModule({
    declarations: [
        ListPriceComponent,
        DashboardComponent,
        ListLicenceComponent,
        AddCompanyPartnerComponent,
        ListCompanyPartnerComponent,
        ListDispatchInvoiceComponent,
    ],
    imports: [
        UtilityModule,
        AdminShareModule,
        RouterModule.forChild([
            { path: '', component: DashboardComponent, pathMatch: 'full', data: { state: 'dashboard'}, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class DashboardModule { }
