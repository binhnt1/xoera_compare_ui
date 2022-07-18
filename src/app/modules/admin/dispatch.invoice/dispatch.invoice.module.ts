import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { AdminShareModule } from '../admin.share.module';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { PipeType } from '../../../_core/domains/enums/pipe.type';
import { ActionType } from '../../../_core/domains/enums/action.type';
import { AdminAuthGuard } from '../../../_core/guards/admin.auth.guard';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { DispatchInvoiceEntity } from '../../../_core/domains/entities/dispatch.invoice.entity';
import { EditDispatchInvoiceComponent } from './edit.dispatch.invoice/edit.dispatch.invoice.component';
import { ListDispatchInvoiceDetailComponent } from './components/list.dispatch.invoice.detail.component';
import { EditDispatchInvoiceDetailComponent } from './edit.dispatch.invoice.detail/edit.dispatch.invoice.detail.component';
import { FileDispatchInvoiceComponent } from './file.dispatch.invoice/file.dispatch.invoice.component';
import { NavigationStateData } from 'src/app/_core/domains/data/navigation.state';
import { ActionData } from 'src/app/_core/domains/data/action.data';

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class DispatchInvoiceComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        UpdatedBy: false,
        Actions: [
            ActionData.view((item: any) => this.view(item))
        ],
        MoreActions: [{
            name: 'View Invoice File',
            systemName: ActionType.View,
            controllerName: 'DispatchInvoiceDetail',
            click: (item: any) => {
                this.viewFileInvoice(item);
            }
        }],
        Size: ModalSizeType.Default,
        Reference: DispatchInvoiceEntity,
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            { Property: 'Code', Type: DataType.String },
            { Property: 'DeliveryPhone', Type: DataType.String },
            { Property: 'DeliveryAddress', Type: DataType.String },
            { Property: 'DeliveryPostCode', Type: DataType.String },
            {
                Property: 'Details', Type: DataType.Number, Align: 'center',
                Click: (item: any) => {
                    this.dialogService.WapperAsync({
                        cancelText: 'Close',
                        confirmText: 'Save',
                        title: 'Invoice Details',
                        size: ModalSizeType.Large,
                        object: ListDispatchInvoiceDetailComponent,
                        objectExtra: {
                            id: item.Id,
                            viewer: true,
                        }
                    });
                }
            },
            { Property: 'PaymentType', Type: DataType.DropDown },
            { Property: 'IssueDate', Type: DataType.DateTime, PipeType: PipeType.Date },
            { Property: 'DueDate', Type: DataType.DateTime, PipeType: PipeType.Date },
        ];
        if (this.authen.management) {
            this.properties.splice(1, 0, { Property: 'Account', Type: DataType.String });
        }
        this.render(this.obj);
    }

    addNew() {
        let obj: NavigationStateData = {
            prevData: this.itemData,
            prevUrl: '/admin/dispatchinvoice',
        };
        this.router.navigate(['/admin/dispatchinvoice/add'], { state: { params: JSON.stringify(obj) } });
    }

    view(item: any) {
        let obj: NavigationStateData = {
            id: item.Id,
            viewer: true,
            prevData: this.itemData,
            prevUrl: '/admin/dispatchinvoice',
        };
        this.router.navigate(['/admin/dispatchinvoice/view'], { state: { params: JSON.stringify(obj) } });
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

@NgModule({
    declarations: [
        DispatchInvoiceComponent,
        EditDispatchInvoiceComponent,
        EditDispatchInvoiceDetailComponent,
        ListDispatchInvoiceDetailComponent,
    ],
    imports: [
        UtilityModule,
        AdminShareModule,
        RouterModule.forChild([
            { path: '', component: DispatchInvoiceComponent, pathMatch: 'full', data: { state: 'dispatch_invoice' }, canActivate: [AdminAuthGuard] },
            { path: 'add', component: EditDispatchInvoiceComponent, pathMatch: 'full', data: { state: 'dispatch_invoice_add' }, canActivate: [AdminAuthGuard] },
            { path: 'view', component: EditDispatchInvoiceComponent, pathMatch: 'full', data: { state: 'dispatch_invoice_view' }, canActivate: [AdminAuthGuard] },
            { path: 'edit', component: EditDispatchInvoiceComponent, pathMatch: 'full', data: { state: 'dispatch_invoice_edit' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class DispatchInvoiceModule { }