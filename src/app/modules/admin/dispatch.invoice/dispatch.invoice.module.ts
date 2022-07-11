import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { AdminAuthGuard } from '../../../_core/guards/admin.auth.guard';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { DispatchInvoiceEntity } from '../../../_core/domains/entities/dispatch.invoice.entity';
import { EditDispatchInvoiceComponent } from './edit.dispatch.invoice/edit.dispatch.invoice.component';

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class DispatchInvoiceComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        UpdatedBy: false,
        Size: ModalSizeType.Default,
        Reference: DispatchInvoiceEntity,
    };
    index: number = 0;

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
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
            { Property: 'IssueDate', Type: DataType.DateTime },
        ];
        if (this.authen.management) {
            this.properties.splice(1, 0, { Property: 'Account', Type: DataType.String });
        }
        this.render(this.obj);
    }

    addNew() {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            confirmText: 'Create',
            title: 'Create Invoice',
            size: ModalSizeType.Default,
            object: EditDispatchInvoiceComponent,
        }, async () => {
            await this.loadItems();
        });
    }

    edit(item: DispatchInvoiceEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            confirmText: 'Save',
            title: 'Edit Invoice',
            size: ModalSizeType.Default,
            object: EditDispatchInvoiceComponent,
            objectExtra: {
                id: item.Id,
            }
        }, async () => {
            await this.loadItems();
        });
    }

    view(item: DispatchInvoiceEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            title: 'View Invoice',
            size: ModalSizeType.Default,
            object: EditDispatchInvoiceComponent,
            objectExtra: {
                id: item.Id,
                viewer: true,
            }
        });
    }
}

@NgModule({
    declarations: [DispatchInvoiceComponent, EditDispatchInvoiceComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: DispatchInvoiceComponent, pathMatch: 'full', data: { state: 'dispatch_invoice' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class DispatchInvoiceModule { }