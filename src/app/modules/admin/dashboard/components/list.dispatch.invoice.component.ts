import { Component } from "@angular/core";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { PipeType } from "../../../../_core/domains/enums/pipe.type";
import { ActionType } from "../../../../_core/domains/enums/action.type";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { DispatchInvoiceEntity } from "../../../../_core/domains/entities/dispatch.invoice.entity";
import { FileDispatchInvoiceComponent } from "../../dispatch.invoice/file.dispatch.invoice/file.dispatch.invoice.component";

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
                    this.viewFileInvoice(item);
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
            { Property: 'Code', Type: DataType.String },
            { Property: 'Address', Type: DataType.String },
            { Property: 'PostCode', Type: DataType.String },
            { Property: 'Details', Type: DataType.Number, Align: 'center' },
            { Property: 'PaymentType', Type: DataType.DropDown },
            { Property: 'IssueDate', Type: DataType.DateTime, PipeType: PipeType.Date },
            { Property: 'DueDate', Type: DataType.DateTime, PipeType: PipeType.Date },
        ];
        this.render(this.obj);
    }

    viewFileInvoice(item: DispatchInvoiceEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            confirmText: 'Download',
            title: 'View Invoice File',
            size: ModalSizeType.Large,
            object: FileDispatchInvoiceComponent,
            objectExtra: {
                invoiceId: item.Id,
            }
        }, async () => {
            await this.loadItems();
        });
    }
}