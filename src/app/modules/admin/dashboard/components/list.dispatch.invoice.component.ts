import { Component } from "@angular/core";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { PipeType } from "../../../../_core/domains/enums/pipe.type";
import { ActionType } from "../../../../_core/domains/enums/action.type";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { DispatchInvoiceEntity } from "../../../../_core/domains/entities/dispatch.invoice.entity";

@Component({
    selector: 'list-dispatch-invoice',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class ListDispatchInvoiceComponent extends GridComponent {
    obj: GridData = {
        Title: '',
        Imports: [],
        Exports: [],
        Filters: [],
        Actions: [
            {
                icon: 'la la-eye',
                name: ActionType.View,
                systemName: ActionType.Empty,
                className: 'btn btn-warning',
                click: (item: any) => {
                    
                }
            },
            {
                icon: 'la la-download',
                name: ActionType.Download,
                className: 'btn btn-danger',
                systemName: ActionType.Empty,
                click: (item: any) => {
                }
            },
        ],
        Features: [],
        IsPopup: true,
        UpdatedBy: false,
        HideSearch: true,
        HideCustomFilter: true,
        Size: ModalSizeType.Default,
        InlineFilters: ['IssueDate'],
        Reference: DispatchInvoiceEntity,
    };
    index: number = 0;

    constructor() {
        super();
        this.properties = [
            {
                Property: 'No', Type: DataType.Number,
                Format: ((item: any) => {
                    this.index += 1;
                    return this.index.toString();
                })
            },
            { Property: 'Period', Type: DataType.String },
            { Property: 'Amount', Type: DataType.Number },
            { Property: 'PaidUnpaid', Type: DataType.Number },
            { Property: 'IssueDate', Type: DataType.DateTime, PipeType: PipeType.Date },
        ];
        this.render(this.obj);
    }
}