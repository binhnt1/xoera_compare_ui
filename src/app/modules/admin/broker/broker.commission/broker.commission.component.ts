import { Component, Input, OnInit } from "@angular/core";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { ActionData } from "../../../../_core/domains/data/action.data";
import { BaseEntity } from "../../../../_core/domains/entities/base.entity";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { EditBrokerCommissionComponent } from "./edit/edit.broker.commission.component";
import { AgencyCommissionEntity } from "../../../../_core/domains/entities/broker.commission.entity";

@Component({
    selector: 'list-broker-commission',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class BrokerCommissionComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Filters: [],
        Imports: [],
        Exports: [],
        Features: [
            ActionData.reload(() => this.loadItems())
        ],
        Actions: [
            ActionData.view((item: any) => {
                this.view(item);
            }),
        ],
        IsPopup: true,
        LastUpdatedBy: false,
        HideCustomFilter: true,
        Reference: AgencyCommissionEntity,
    };
    @Input() brokerId: number;
    @Input() readonly: boolean;

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            { Property: 'LogoString', Title: 'Logo', Type: DataType.Image },
            { Property: 'Abbreviation', Title: 'Supplier Name', Type: DataType.String },
            { Property: 'GasRate', Type: DataType.Number },
            { Property: 'ValidFrom', Type: DataType.DateTime },
            { Property: 'ValidUntil', Type: DataType.DateTime },
        ];
    }

    view(item: BaseEntity): void {
        let obj = {
            id: item.Id,
            viewer: true,
            tab: 'commission',
            readonly: this.readonly,
            brokerId: this.brokerId,
            prevUrl: '/admin/broker/edit',
        };
        this.router.navigate(['/admin/broker/brokercommission/view'], { state: { params: JSON.stringify(obj) } });
    }

    async ngOnInit() {
        this.obj.Url = '/Admin/AgencyCommission/Items/' + this.brokerId;
        if (this.readonly) {
            this.obj.Features = [ActionData.reload(() => this.loadItems())];
            this.obj.Actions = [ActionData.view((item: any) => this.view(item))];
        }
        await this.render(this.obj);
        this.obj.Title = '';
    }
}