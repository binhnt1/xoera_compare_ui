import { Component, Input, OnInit } from "@angular/core";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { ActionData } from "../../../../_core/domains/data/action.data";
import { BaseEntity } from "../../../../_core/domains/entities/base.entity";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { AgencyAddressEntity } from "../../../../_core/domains/entities/broker.address.entity";

@Component({
    selector: 'list-broker-address',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class BrokerAddressComponent extends GridComponent implements OnInit {
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
        Reference: AgencyAddressEntity,
    };
    @Input() readonly: boolean;
    @Input() brokerId: number;

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            { Property: 'AddressLine1', Type: DataType.String },
            { Property: 'Postcode', Type: DataType.String },
            { Property: 'EffectiveFrom', Type: DataType.DateTime },
        ];
    }

    addNew(): void {
        let obj = {
            tab: 'address',
            readonly: this.readonly,
            brokerId: this.brokerId,
            prevUrl: '/admin/broker/edit',
        };
        this.router.navigate(['/admin/broker/brokeraddress/add'], { state: { params: JSON.stringify(obj) } });
    }

    edit(item: BaseEntity): void {
        let obj = {
            id: item.Id,
            tab: 'address',
            readonly: this.readonly,
            brokerId: this.brokerId,
            prevUrl: '/admin/broker/edit',
        };
        this.router.navigate(['/admin/broker/brokeraddress/edit'], { state: { params: JSON.stringify(obj) } });
    }

    view(item: BaseEntity): void {
        let obj = {
            id: item.Id,
            viewer: true,
            tab: 'address',
            readonly: this.readonly,
            brokerId: this.brokerId,
            prevUrl: '/admin/broker/edit',
        };
        this.router.navigate(['/admin/broker/brokeraddress/view'], { state: { params: JSON.stringify(obj) } });
    }

    async ngOnInit() {
        this.obj.Url = '/Admin/AgencyAddress/Items/' + this.brokerId;
        if (this.readonly) {
            this.obj.Features = [ActionData.reload(() => this.loadItems())];
            this.obj.Actions = [ActionData.view((item: any) => this.view(item))];
        }
        await this.render(this.obj);
        this.obj.Title = '';
    }
}