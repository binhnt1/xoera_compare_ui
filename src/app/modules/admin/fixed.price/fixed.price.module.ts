import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { EditFixedPriceComponent } from './edit.fixed.price/edit.fixed.price.component';
import { AdminAuthGuard } from '../../../_core/guards/admin.auth.guard';
import { FixedPriceEntity } from '../../../_core/domains/entities/fixed.price.entity';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class FixedPriceComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        UpdatedBy: false,
        Size: ModalSizeType.Small,
        Reference: FixedPriceEntity,
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            { Property: 'Tariff', Type: DataType.String },
            { Property: 'Vehicle', Type: DataType.String },
            { Property: 'Price', Type: DataType.Number },
            { Property: 'Drop', Type: DataType.Number },
            { Property: 'Return', Type: DataType.Number },
            { Property: 'ReverseDirection', Type: DataType.Boolean },
            { Property: 'Start', Type: DataType.String },
            { Property: 'End', Type: DataType.String },
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
            title: 'Create Fixed Price',
            size: ModalSizeType.Large,
            object: EditFixedPriceComponent,
        }, async () => {
            await this.loadItems();
        });
    }

    edit(item: FixedPriceEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            confirmText: 'Save',
            title: 'Edit Fixed Price',
            size: ModalSizeType.Large,
            object: EditFixedPriceComponent,
            objectExtra: {
                id: item.Id,
            }
        }, async () => {
            await this.loadItems();
        });
    }

    view(item: FixedPriceEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            title: 'View Fixed Price',
            size: ModalSizeType.Large,
            object: EditFixedPriceComponent,
            objectExtra: {
                id: item.Id,
                viewer: true,
            }
        });
    }
}

@NgModule({
    declarations: [FixedPriceComponent, EditFixedPriceComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: FixedPriceComponent, pathMatch: 'full', data: { state: 'fixedprice' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class FixedPriceModule { }