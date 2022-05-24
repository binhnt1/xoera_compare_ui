import { Component, Input, OnInit } from "@angular/core";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { ActionData } from "../../../../_core/domains/data/action.data";
import { BaseEntity } from "../../../../_core/domains/entities/base.entity";
import { AuditEntity } from "../../../../_core/domains/entities/audit.entity";
import { GridComponent } from "../../../../_core/components/grid/grid.component";

@Component({
    selector: 'list-broker-audit',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class BrokerAuditComponent extends GridComponent implements OnInit {
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
        Reference: AuditEntity,
        InlineFilters: ['TableName']
    };
    @Input() brokerId: number;
    @Input() readonly: boolean;

    constructor() {
        super();
        this.properties = [
            { Property: 'DateTime', Type: DataType.DateTime },
            { Property: 'Actions', Type: DataType.String },
            { Property: 'TableIdValue', Type: DataType.String },
            { Property: 'MachineName', Type: DataType.String },
            { Property: 'CallingMethod', Type: DataType.String },
            { Property: 'IpAddress', Type: DataType.String },
            { Property: 'User', Type: DataType.String },
        ];
    }

    view(item: BaseEntity): void {
        let obj = {
            id: item.Id,
            viewer: true,
            tab: 'audit',
            readonly: this.readonly,
            brokerId: this.brokerId,
            prevUrl: '/admin/broker/edit',
        };
        this.router.navigate(['/admin/broker/audit/view'], { state: { params: JSON.stringify(obj) } });
    }

    async ngOnInit() {
        this.obj.Url = '/Admin/Audit/AgencyItems/' + this.brokerId;
        if (this.readonly) {
            this.obj.Features = [ActionData.reload(() => this.loadItems())];
            this.obj.Actions = [ActionData.view((item: any) => this.view(item))];
        }
        await this.render(this.obj);
        this.obj.Title = '';
    }
}