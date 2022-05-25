import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { EditPriceComponent } from './edit.price/edit.price.component';
import { AdminAuthGuard } from '../../../_core/guards/admin.auth.guard';
import { PriceEntity } from '../../../_core/domains/entities/price.entity';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class PriceComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        UpdatedBy: false,
        Size: ModalSizeType.Small,
        Reference: PriceEntity,
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            { Property: 'Tariff', Type: DataType.String },
            { Property: 'Vehicle', Type: DataType.String },
            { Property: 'PerMile', Type: DataType.Number },           
            { Property: 'Drop', Type: DataType.Number },           
            { Property: 'Return', Type: DataType.Number },           
            { Property: 'MinimumFare', Type: DataType.Number },           
            { Property: 'WaitRateMin', Type: DataType.Number },           
            { Property: 'InitialRate', Type: DataType.Number },           
            { Property: 'InitialMiles', Type: DataType.Number },           
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
            title: 'Create Price',
            size: ModalSizeType.Large,
            object: EditPriceComponent,
        }, async () => {
            await this.loadItems();
        });
    }

    edit(item: PriceEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            confirmText: 'Save',
            title: 'Edit Price',
            size: ModalSizeType.Large,
            object: EditPriceComponent,
            objectExtra: {
                id: item.Id,
            }
        }, async () => {
            await this.loadItems();
        });
    }

    view(item: PriceEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            title: 'View Price',
            size: ModalSizeType.Large,
            object: EditPriceComponent,
            objectExtra: {
                id: item.Id,
                viewer: true,
            }
        });
    }
}

@NgModule({
    declarations: [PriceComponent, EditPriceComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: PriceComponent, pathMatch: 'full', data: { state: 'price' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class PriceModule { }