import { Component, Input, OnInit } from "@angular/core";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { ActionData } from "../../../../_core/domains/data/action.data";
import { BaseEntity } from "../../../../_core/domains/entities/base.entity";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { EditBrokerBankAccountComponent } from "./edit/edit.broker.bank.account.component";
import { AgencyBankAccountEntity } from "../../../../_core/domains/entities/broker.bank.account.entity";

@Component({
    selector: 'list-broker-bank-account',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class BrokerBankAccountComponent extends GridComponent implements OnInit {
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
        Reference: AgencyBankAccountEntity,
    };
    @Input() brokerId: number;
    @Input() readonly: boolean;

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            { Property: 'BankName', Type: DataType.String },
            { Property: 'AccountName', Type: DataType.String },
            { Property: 'SortCode', Type: DataType.String },
            { Property: 'AccountNumber', Type: DataType.String },
            { Property: 'Active', Type: DataType.Boolean, Align: 'center' },
        ];
    }

    addNew(): void {
        let obj = {
            tab: 'account',
            readonly: this.readonly,
            brokerId: this.brokerId,
            prevUrl: '/admin/broker/edit',
        };
        this.router.navigate(['/admin/broker/brokerbankaccount/add'], { state: { params: JSON.stringify(obj) } });
    }

    edit(item: BaseEntity): void {
        let obj = {
            id: item.Id,
            tab: 'account',
            readonly: this.readonly,
            brokerId: this.brokerId,
            prevUrl: '/admin/broker/edit',
        };
        this.router.navigate(['/admin/broker/brokerbankaccount/edit'], { state: { params: JSON.stringify(obj) } });
    }

    view(item: BaseEntity): void {
        let obj = {
            id: item.Id,
            viewer: true,
            tab: 'account',
            readonly: this.readonly,
            brokerId: this.brokerId,
            prevUrl: '/admin/broker/edit',
        };
        this.router.navigate(['/admin/broker/brokerbankaccount/view'], { state: { params: JSON.stringify(obj) } });
    }

    async ngOnInit() {
        this.obj.Url = '/Admin/AgencyBankAccount/Items/' + this.brokerId;
        if (this.readonly) {
            this.obj.Features = [ActionData.reload(() => this.loadItems())];
            this.obj.Actions = [ActionData.view((item: any) => this.view(item))];
        }
        await this.render(this.obj);
        this.obj.Title = '';
    }
}