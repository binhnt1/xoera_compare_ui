import { RouterModule } from "@angular/router";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { EditBrokerComponent } from "./edit/edit.broker.component";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { BrokerNoteComponent } from "./broker.note/broker.note.component";
import { AgencyEntity } from "../../../_core/domains/entities/broker.entity";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { BrokerAuditComponent } from "./broker.audit/broker.audit.component";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { BrokerAddressComponent } from "./broker.address/broker.address.component";
import { BrokerContactComponent } from "./broker.contact/broker.contact.component";
import { NavigationStateData } from "../../../_core/domains/data/navigation.state";
import { BrokerDocumentComponent } from "./broker.document/broker.document.component";
import { EditBrokerAuditComponent } from "./broker.audit/edit/edit.broker.audit.component";
import { BrokerCommissionComponent } from "./broker.commission/broker.commission.component";
import { BrokerPermissionComponent } from "./broker.permission/broker.permission.component";
import { BrokerBankAccountComponent } from "./broker.bank.account/broker.bank.account.component";
import { EditBrokerAddressComponent } from "./broker.address/edit/edit.broker.address.component";
import { EditBrokerContactComponent } from "./broker.contact/edit/edit.broker.contact.component";
import { EditBrokerDocumentComponent } from "./broker.document/edit/edit.broker.document.component";
import { EditBrokerCommissionComponent } from "./broker.commission/edit/edit.broker.commission.component";
import { EditBrokerBankAccountComponent } from "./broker.bank.account/edit/edit.broker.bank.account.component";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class BrokerComponent extends GridComponent {
    obj: GridData = {
        Filters: [],        
        Imports: [],
        Exports: [],
        LastUpdatedBy: false,
        Reference: AgencyEntity,
        Size: ModalSizeType.FullScreen,
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            { Property: 'AgencyNumber', Title: 'Broker Number', Type: DataType.String },
            { Property: 'AgencyName', Title: 'Broker Name', Type: DataType.String },
            { Property: 'Status', Type: DataType.String },
            { Property: 'PrincipalContact', Type: DataType.String },
            { Property: 'Telephone', Type: DataType.String },
            { Property: 'EmailAddress', Type: DataType.String },
            { Property: 'Employee', Title: 'Account Manager', Type: DataType.String },
        ];
        this.render(this.obj);
    }

    addNew() {
        let obj: NavigationStateData = {
            prevData: this.itemData,
            prevUrl: '/admin/broker',
        };
        this.router.navigate(['/admin/broker/add'], { state: { params: JSON.stringify(obj) } });
    }

    edit(item: AgencyEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevData: this.itemData,
            prevUrl: '/admin/broker',
        };
        this.router.navigate(['/admin/broker/edit'], { state: { params: JSON.stringify(obj) } });
    }

    view(item: AgencyEntity) {
        let obj = {
            id: item.Id,
            readonly: true,
            prevData: this.itemData,
            prevUrl: '/admin/broker',
        };
        this.router.navigate(['/admin/broker/view'], { state: { params: JSON.stringify(obj) } });
    }
}

@NgModule({
    declarations: [
        BrokerComponent,
        BrokerNoteComponent,
        EditBrokerComponent,
        BrokerAuditComponent,
        BrokerAddressComponent,
        BrokerContactComponent,
        BrokerDocumentComponent,
        EditBrokerAuditComponent,
        BrokerPermissionComponent,
        BrokerCommissionComponent,
        BrokerBankAccountComponent,
        EditBrokerAddressComponent,
        EditBrokerContactComponent,
        EditBrokerDocumentComponent,
        EditBrokerCommissionComponent,
        EditBrokerBankAccountComponent,
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: BrokerComponent, pathMatch: 'full', data: { state: 'broker' }, canActivate: [AdminAuthGuard] },         
            { path: 'add', component: EditBrokerComponent, pathMatch: 'full', data: { state: 'add_broker'}, canActivate: [AdminAuthGuard] },
            { path: 'edit', component: EditBrokerComponent, pathMatch: 'full', data: { state: 'edit_broker'}, canActivate: [AdminAuthGuard] },
            { path: 'view', component: EditBrokerComponent, pathMatch: 'full', data: { state: 'view_broker'}, canActivate: [AdminAuthGuard] },
            { path: 'audit/view', component: EditBrokerAuditComponent, pathMatch: 'full', data: { state: 'view_audit'}, canActivate: [AdminAuthGuard] },
            { path: 'brokercontact/add', component: EditBrokerContactComponent, pathMatch: 'full', data: { state: 'add_brokercontact'}, canActivate: [AdminAuthGuard] },
            { path: 'brokercontact/edit', component: EditBrokerContactComponent, pathMatch: 'full', data: { state: 'edit_brokercontact'}, canActivate: [AdminAuthGuard] },
            { path: 'brokercontact/view', component: EditBrokerContactComponent, pathMatch: 'full', data: { state: 'view_brokercontact'}, canActivate: [AdminAuthGuard] },
            { path: 'brokeraddress/add', component: EditBrokerAddressComponent, pathMatch: 'full', data: { state: 'add_brokeraddress'}, canActivate: [AdminAuthGuard] },
            { path: 'brokeraddress/edit', component: EditBrokerAddressComponent, pathMatch: 'full', data: { state: 'edit_brokeraddress'}, canActivate: [AdminAuthGuard] },
            { path: 'brokeraddress/view', component: EditBrokerAddressComponent, pathMatch: 'full', data: { state: 'view_brokeraddress'}, canActivate: [AdminAuthGuard] },
            { path: 'brokerdocument/add', component: EditBrokerDocumentComponent, pathMatch: 'full', data: { state: 'add_brokerdocument'}, canActivate: [AdminAuthGuard] },
            { path: 'brokerdocument/edit', component: EditBrokerDocumentComponent, pathMatch: 'full', data: { state: 'edit_brokerdocument'}, canActivate: [AdminAuthGuard] },
            { path: 'brokerdocument/view', component: EditBrokerDocumentComponent, pathMatch: 'full', data: { state: 'view_brokerdocument'}, canActivate: [AdminAuthGuard] },
            { path: 'brokercommission/view', component: EditBrokerCommissionComponent, pathMatch: 'full', data: { state: 'view_brokercommission'}, canActivate: [AdminAuthGuard] },
            { path: 'brokerbankaccount/add', component: EditBrokerBankAccountComponent, pathMatch: 'full', data: { state: 'add_brokerbankaccount'}, canActivate: [AdminAuthGuard] },
            { path: 'brokerbankaccount/edit', component: EditBrokerBankAccountComponent, pathMatch: 'full', data: { state: 'edit_brokerbankaccount'}, canActivate: [AdminAuthGuard] },
            { path: 'brokerbankaccount/view', component: EditBrokerBankAccountComponent, pathMatch: 'full', data: { state: 'view_brokerbankaccount'}, canActivate: [AdminAuthGuard] },
        ])
    ],
})
export class BrokerModule { }