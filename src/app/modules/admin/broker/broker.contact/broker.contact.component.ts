import { Component, Input, OnInit } from "@angular/core";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { ActionData } from "../../../../_core/domains/data/action.data";
import { BaseEntity } from "../../../../_core/domains/entities/base.entity";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { EditBrokerContactComponent } from "./edit/edit.broker.contact.component";
import { AgencyContactEntity } from "../../../../_core/domains/entities/broker.contact.entity";

@Component({
    selector: 'list-broker-contact',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class BrokerContactComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Filters: [],
        Imports: [],
        Exports: [],
        Features: [
            ActionData.addNew(() => this.addNew()),
            ActionData.reload(() => this.loadItems())
        ],
        IsPopup: true,
        LastUpdatedBy: false,
        HideCustomFilter: true,
        Reference: AgencyContactEntity,
    };
    @Input() brokerId: number;
    @Input() readonly: boolean;

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            { Property: 'Firstname', Type: DataType.String },
            { Property: 'Surname', Type: DataType.String },
            { Property: 'Email', Type: DataType.String },
            { Property: 'Telephone', Type: DataType.String },
            { Property: 'Mobile', Type: DataType.String },
        ];
    }

    addNew(): void {
        let obj = {
            tab: 'contact',
            readonly: this.readonly,
            brokerId: this.brokerId,
            prevUrl: '/admin/broker/edit',
        };
        this.router.navigate(['/admin/broker/brokercontact/add'], { state: { params: JSON.stringify(obj) } });
    }

    edit(item: BaseEntity): void {
        let obj = {
            id: item.Id,
            tab: 'contact',
            readonly: this.readonly,
            brokerId: this.brokerId,
            prevUrl: '/admin/broker/edit',
        };
        this.router.navigate(['/admin/broker/brokercontact/edit'], { state: { params: JSON.stringify(obj) } });
    }

    view(item: BaseEntity): void {
        let obj = {
            id: item.Id,
            viewer: true,
            tab: 'contact',
            readonly: this.readonly,
            brokerId: this.brokerId,
            prevUrl: '/admin/broker/edit',
        };
        this.router.navigate(['/admin/broker/brokercontact/view'], { state: { params: JSON.stringify(obj) } });
    }

    async ngOnInit() {
        this.obj.Url = '/Admin/AgencyContact/Items/' + this.brokerId;
        if (this.readonly) {
            this.obj.Features = [ActionData.reload(() => this.loadItems())];
            this.obj.Actions = [ActionData.view((item: any) => this.view(item))];
        }
        await this.render(this.obj);
        this.obj.Title = '';
    }
}