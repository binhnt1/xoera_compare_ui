import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { AdminShareModule } from '../admin.share.module';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { SiteTestComponent } from './site.test/site.test.component';
import { ViewSiteComponent } from './view.site/view.site.component';
import { ListMprnComponent } from './list.mprn/list.mprn.component';
import { ActionData } from '../../../_core/domains/data/action.data';
import { ListMeterComponent } from './list.meter/list.meter.component';
import { ViewMeterComponent } from './view.meter/view.meter.component';
import { AdminAuthGuard } from '../../../_core/guards/admin.auth.guard';
import { SiteEntity } from '../../../_core/domains/entities/site.entity';
import { ListHubFileComponent } from './list.hubfile/list.hubfile.component';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { PopupAddSiteComponent } from './popup.add.site/popup.add.site.component';
import { NavigationStateData } from '../../../_core/domains/data/navigation.state';
import { ListMeterReadComponent } from './list.meter.read/list.meter.read.component';
import { ViewContentComponent } from './site.test/view.content/view.content.component';
import { ViewMeterPointComponent } from './view.meter.point/view.meter.point.component';
import { PopupT05RequestComponent } from './popup.t05.request/popup.t05.request.component';
import { PopupS40RequestComponent } from './popup.s40.request/popup.s40.request.component';
import { PopupC42RequestComponent } from './popup.c42.request/popup.c42.request.component';
import { PopupC41RequestComponent } from './popup.c41.request/popup.c41.request.component';
import { PopupCOARequestComponent } from './popup.coa.request/popup.coa.request.component';
import { PopupONARequestComponent } from './popup.ona.request/popup.ona.request.component';
import { PopupU01RequestComponent } from './popup.u01.request/popup.u01.request.component';
import { PopupPO3RequestComponent } from './popup.po3.request/popup.po3.request.component';
import { ListMeterReadU01Component } from './list.meter.read/list.meter.read.u01.component';
import { PopupDateRequestComponent } from './popup.date.request/popup.date.request.component';
import { PopupONUPDRequestComponent } from './popup.onupd.request/popup.onupd.request.component';
import { PopupONJOBRequestComponent } from './popup.onjob.request/popup.onjob.request.component';
import { PopupORJOBRequestComponent } from './popup.orjob.request/popup.orjob.request.component';
import { PopupONADeAppRequestComponent } from './popup.ona.deapp.request/popup.ona.deapp.request.component';

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class SiteComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        Features: [
            ActionData.addNew(() => {
                this.addNew();
            }),
            ActionData.reload(() => this.loadItems())
        ],
        Actions: [
            ActionData.view((item: any) => {
                this.view(item);
            }),
        ],
        LastUpdatedBy: false,
        Reference: SiteEntity,
        Size: ModalSizeType.Large,        
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            { Property: 'Type', Type: DataType.String },
            {
                Property: 'SiteRef', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '<p>' + item.BillingStreet + '</p>';
                    if (item.SiteName) text += '<p>Site Name: ' + item.SiteName + '</p>';
                    if (item.Postcode) text += '<p>Postcode: ' + item.Postcode + '</p>';
                    return text;
                })
            },
            {
                Property: 'BillingStreet', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '<p>' + item.BillingStreet + '</p>';
                    if (item.BillingPostcode)
                        text += '<p>Postcode: ' + item.BillingPostcode + '</p>';
                    return text;
                })
            },
            { Property: 'AccountNumber', Type: DataType.String },
            { Property: 'AccountStatus', Type: DataType.String },
            { Property: 'PrincipalStreet', Type: DataType.String },
            { Property: 'Mpr', Type: DataType.String },
            { Property: 'Status', Type: DataType.String },
            { Property: 'PaymentType', Type: DataType.String },
            { Property: 'Customer', Type: DataType.String },
        ];
        this.render(this.obj);
    }

    addNew() {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            title: 'Add new site',
            confirmText: 'Create site',
            object: PopupAddSiteComponent,
            size: ModalSizeType.ExtraLarge,
        }, async () => { this.loadItems(); });
    }

    view(item: SiteEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            viewer: true,
            prevData: this.itemData,
            prevUrl: '/admin/site',
        };
        this.router.navigate(['/admin/site/view'], { state: { params: JSON.stringify(obj) } });
    }
}

@NgModule({
    declarations: [
        SiteComponent,
        SiteTestComponent,
        ViewSiteComponent,
        ListMprnComponent,
        ViewMeterComponent,
        ListMeterComponent,
        ViewContentComponent,
        ListHubFileComponent,
        PopupAddSiteComponent,
        ListMeterReadComponent,
        ViewMeterPointComponent,
        PopupPO3RequestComponent,
        PopupU01RequestComponent,
        PopupCOARequestComponent,
        PopupONARequestComponent,
        PopupC41RequestComponent,
        PopupC42RequestComponent,
        PopupT05RequestComponent,
        PopupS40RequestComponent,
        PopupDateRequestComponent,
        ListMeterReadU01Component,
        PopupONJOBRequestComponent,
        PopupORJOBRequestComponent,
        PopupONUPDRequestComponent,
        PopupONADeAppRequestComponent,
    ],
    imports: [
        UtilityModule,
        AdminShareModule,
        RouterModule.forChild([
            { path: '', component: SiteComponent, pathMatch: 'full', data: { state: 'site' }, canActivate: [AdminAuthGuard] },
            { path: 'view', component: ViewSiteComponent, pathMatch: 'full', data: { state: 'view_site' }, canActivate: [AdminAuthGuard] },
            { path: 'test', component: SiteTestComponent, pathMatch: 'full', data: { state: 'site_test' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class SiteModule { }