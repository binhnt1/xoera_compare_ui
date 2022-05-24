import { Component, Input, OnInit } from "@angular/core";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { ActionData } from "../../../../_core/domains/data/action.data";
import { BaseEntity } from "../../../../_core/domains/entities/base.entity";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { SentItemEntity } from "../../../../_core/domains/entities/sent.item.entity";
import { EditBrokerLeadSentItemComponent } from "./edit/edit.broker.lead.sent.item.component";

@Component({
    selector: 'list-broker-lead-sent-item',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class BrokerLeadSentItemComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Filters: [],
        Imports: [],
        Exports: [],
        Features: [
            ActionData.addNew(() => {
                this.dialogService.WapperAsync({
                    cancelText: 'Close',
                    confirmText: 'Submit',
                    size: ModalSizeType.Large,
                    title: 'Create send email',
                    object: EditBrokerLeadSentItemComponent,
                    objectExtra: { brokerLeadId: this.brokerLeadId },
                }, async () => { this.loadItems(); });
            }),
            ActionData.reload(() => this.loadItems())
        ],
        IsPopup: true,
        LastUpdatedBy: false,
        HideCustomFilter: true,
        Reference: SentItemEntity,
    };
    @Input() brokerLeadId: number;

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            { Property: 'Email', Type: DataType.String },
            { Property: 'Subject', Type: DataType.String },
            { Property: 'TimeSent', Type: DataType.String },
            { Property: 'Source', Type: DataType.String },
        ];
    }

    edit(item: BaseEntity): void {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            confirmText: 'Submit',
            title: 'Edit send email',
            size: ModalSizeType.Large,
            object: EditBrokerLeadSentItemComponent,
            objectExtra: { 
                id: item.Id,
                brokerLeadId: this.brokerLeadId 
            },
        }, async () => { this.loadItems(); });
    }

    view(item: BaseEntity): void {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            title: 'View send email',
            size: ModalSizeType.Large,
            object: EditBrokerLeadSentItemComponent,
            objectExtra: { 
                id: item.Id,
                viewer: true,
                brokerLeadId: this.brokerLeadId 
            },
        });
    }

    async ngOnInit() {
        this.obj.Url = '/Admin/SentItem/BrokerLeadSentItems/' + this.brokerLeadId;
        await this.render(this.obj);
        this.obj.Title = '';
    }
}