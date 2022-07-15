import { Component, Input, OnInit } from "@angular/core";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { DispatchInvoiceDetailEntity } from "../../../../_core/domains/entities/dispatch.invoice.entity";
import { EditDispatchInvoiceDetailComponent } from "../edit.dispatch.invoice.detail/edit.dispatch.invoice.detail.component";

@Component({
    selector: 'list-dispatch-invoice-detail',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class ListDispatchInvoiceDetailComponent extends GridComponent implements OnInit {
    id: number;
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        IsPopup: true,
        UpdatedBy: false,
        HideSearch: true,
        HideHeadActions: true,
        DisableAutoLoad: true,
        HideCustomFilter: true,
        Size: ModalSizeType.Default,
        Reference: DispatchInvoiceDetailEntity,
    };
    index: number = 0;
    @Input() params: any;

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
            { Property: 'Invoice', Type: DataType.String },
            { Property: 'Period', Type: DataType.String },
            { Property: 'Amount', Type: DataType.Number },
            { Property: 'PaidUnpaid', Type: DataType.Number },
        ];
    }

    ngOnInit(): void {
        this.id = this.params?.id;
        if (this.id) {
            this.obj.Url = '/admin/DispatchInvoiceDetail/Items/' + this.id;
            this.render(this.obj);
        }
    }

    addNew() {
        this.dialogService.WapperAboveAsync({
            cancelText: 'Close',
            confirmText: 'Create',
            title: 'Create Invoice Detail',
            size: ModalSizeType.Default,
            object: EditDispatchInvoiceDetailComponent,
            objectExtra: {
                invoiceId: this.id,
            }
        }, async () => {
            await this.loadItems();
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
        }, async () => {
            await this.loadItems();
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