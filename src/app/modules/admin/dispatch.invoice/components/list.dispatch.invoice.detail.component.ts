import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { DispatchInvoiceDetailEntity } from "../../../../_core/domains/entities/dispatch.invoice.entity";
import { EditDispatchInvoiceDetailComponent } from "../edit.dispatch.invoice.detail/edit.dispatch.invoice.detail.component";
import { ActionData } from "src/app/_core/domains/data/action.data";

@Component({
    selector: 'list-dispatch-invoice-detail',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class ListDispatchInvoiceDetailComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        IsPopup: true,
        Title: 'Details',
        UpdatedBy: false,
        HideSearch: true,
        HidePaging: true,
        DisableAutoLoad: true,
        HideCustomFilter: true,
        Size: ModalSizeType.Default,
        Features: [
            ActionData.addNew(() => this.addNew())
        ],
        Actions: [
            ActionData.edit((item: any) => this.edit(item)),
            ActionData.delete((item: any) => this.delete(item.Id)),
        ],
        Reference: DispatchInvoiceDetailEntity,
    };
    index: number = 0;
    @Input() params: any;
    @Output() valueChange = new EventEmitter<any[]>();

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
            { Property: 'Period', Title: 'Description', Type: DataType.String },
            { Property: 'Amount', Title: 'Qty', Type: DataType.Number, Align: 'right' },
            { Property: 'PaidUnpaid', Title: 'Price', Type: DataType.Number, Align: 'right' },
            { Property: 'Discount', Type: DataType.Number, Align: 'right' },
            { Property: 'SubTotal', Type: DataType.Number, Align: 'right' },
        ];
    }

    ngOnInit(): void {
        let id = this.params && this.params['id'],
            items = this.params && this.params['items'],
            viewer = this.params && this.params['viewer'];
        if (viewer) {
            this.obj.Actions = [];
            this.obj.Features = [];
            this.obj.HideHeadActions = true;
        }
        if (id) {
            this.obj.Url = '/admin/DispatchInvoiceDetail/Items/' + id;
            this.render(this.obj);
        } else {
            this.render(this.obj, items);
            if (!items || items.length == 0)
                this.message = 'Not data available, please add new invoice details';
        }
    }

    addNew() {
        this.dialogService.WapperAboveAsync({
            cancelText: 'Close',
            confirmText: 'Create',
            title: 'Create Invoice Detail',
            size: ModalSizeType.Default,
            object: EditDispatchInvoiceDetailComponent,
        }, async (item: DispatchInvoiceDetailEntity) => {
            item.Id = this.index += 1;
            this.index += 1;

            this.items.push(item);
            this.render(this.obj, this.items);
            this.valueChange.emit(this.items);
        });
    }

    delete(id: number): void {
        this.dialogService.Confirm('Do you want delete item?', () => {
            this.items = this.items.filter(c => c.Id != id);
            this.render(this.obj, this.items);
            this.valueChange.emit(this.items);
        });
    }

    edit(item: DispatchInvoiceDetailEntity) {
        this.dialogService.WapperAboveAsync({
            cancelText: 'Close',
            confirmText: 'Save',
            title: 'Edit Invoice Detail',
            size: ModalSizeType.Default,
            object: EditDispatchInvoiceDetailComponent,
            objectExtra: {
                id: item.Id,
            }
        }, async (item: DispatchInvoiceDetailEntity) => {
            let itemDb = this.items.find(c => c.Id == item.Id);
            if (itemDb) {
                itemDb = item;
                this.render(this.obj, this.items);
                this.valueChange.emit(this.items);
            }
        });
    }

    view(item: DispatchInvoiceDetailEntity) {
        this.dialogService.WapperAboveAsync({
            cancelText: 'Close',
            title: 'View Invoice Detail',
            size: ModalSizeType.Default,
            object: EditDispatchInvoiceDetailComponent,
            objectExtra: {
                id: item.Id,
                viewer: true,
            }
        });
    }
}