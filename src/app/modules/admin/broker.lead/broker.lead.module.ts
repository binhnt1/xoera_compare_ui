import { RouterModule } from "@angular/router";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { BaseEntity } from "../../../_core/domains/entities/base.entity";
import { EditBrokerLeadComponent } from "./edit/edit.broker.lead.component";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { NavigationStateData } from "../../../_core/domains/data/navigation.state";
import { BrokerLeadEntity } from "../../../_core/domains/entities/broker.lead.entity";
import { BrokerLeadNoteComponent } from "./broker.lead.note/broker.lead.note.component";
import { BrokerLeadSentItemComponent } from "./broker.lead.sent.item/broker.lead.sent.item.component";
import { EditBrokerLeadSentItemComponent } from "./broker.lead.sent.item/edit/edit.broker.lead.sent.item.component";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class BrokerLeadComponent extends GridComponent {
    obj: GridData = {
        Filters: [],
        LastUpdatedBy: false,
        Reference: BrokerLeadEntity,
        Size: ModalSizeType.FullScreen,
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            { Property: 'BusinessName', Type: DataType.String },
            { Property: 'ContactName', Type: DataType.String },
            {
                Property: 'Phone1', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '';
                    if (item.Phone1) text += '<p>Phone: ' + item.Phone1 + '</p>';
                    if (item.Email1) text += '<p>Email: ' + item.Email1 + '</p>';
                    if (item.Mobile1) text += '<p>Mobile: ' + item.Mobile1 + '</p>';
                    return text;
                })
            },
            {
                Property: 'Website', Type: DataType.String,
                Format: ((item: any) => {
                    return item.Website
                        ? '<a target="_blank" href="' + item.Website + '">' + item.Website + '</a>'
                        : null;
                })
            },
            { Property: 'Address', Type: DataType.String },
        ];
        this.render(this.obj);
    }

    addNew() {
        let obj: NavigationStateData = {
            prevData: this.itemData,
            prevUrl: '/admin/brokerlead',
        };
        this.router.navigate(['/admin/brokerlead/add'], { state: { params: JSON.stringify(obj) } });
    }

    edit(item: BaseEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevData: this.itemData,
            prevUrl: '/admin/brokerlead',
        };
        this.router.navigate(['/admin/brokerlead/edit'], { state: { params: JSON.stringify(obj) } });
    }

    view(item: BaseEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            viewer: true,
            prevData: this.itemData,
            prevUrl: '/admin/brokerlead',
        };
        this.router.navigate(['/admin/brokerlead/view'], { state: { params: JSON.stringify(obj) } });
    }
}

@NgModule({
    declarations: [
        BrokerLeadComponent,
        EditBrokerLeadComponent,
        BrokerLeadNoteComponent,
        BrokerLeadSentItemComponent,
        EditBrokerLeadSentItemComponent,
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: BrokerLeadComponent, pathMatch: 'full', data: { state: 'brokerlead' }, canActivate: [AdminAuthGuard] },
            { path: 'add', component: EditBrokerLeadComponent, pathMatch: 'full', data: { state: 'add_brokerlead'}, canActivate: [AdminAuthGuard] },
            { path: 'edit', component: EditBrokerLeadComponent, pathMatch: 'full', data: { state: 'edit_brokerlead'}, canActivate: [AdminAuthGuard] },
            { path: 'view', component: EditBrokerLeadComponent, pathMatch: 'full', data: { state: 'view_brokerlead'}, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class BrokerLeadModule { }