import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { UserType } from '../../../_core/domains/enums/user.type';
import { AdminAuthGuard } from '../../../_core/guards/admin.auth.guard';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { PriceHikeEntity } from '../../../_core/domains/entities/price.hike.entity';
import { EditPriceHikeComponent } from './edit.price.hike/edit.price.hike.component';

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class PriceHikeComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        UpdatedBy: false,
        Size: ModalSizeType.Small,
        Reference: PriceHikeEntity,
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            { Property: 'Start', Type: DataType.DateTime },
            { Property: 'End', Type: DataType.DateTime },
            { Property: 'Amount', Type: DataType.Number },           
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
            title: 'Create Price Hike',
            size: ModalSizeType.Small,
            object: EditPriceHikeComponent,
        }, async () => {
            await this.loadItems();
        });
    }

    edit(item: PriceHikeEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            confirmText: 'Save',
            title: 'Edit Price Hike',
            size: ModalSizeType.Small,
            object: EditPriceHikeComponent,
            objectExtra: {
                id: item.Id,
            }
        }, async () => {
            await this.loadItems();
        });
    }

    view(item: PriceHikeEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            title: 'View Price Hike',
            size: ModalSizeType.Small,
            object: EditPriceHikeComponent,
            objectExtra: {
                id: item.Id,
                viewer: true,
            }
        });
    }
}

@NgModule({
    declarations: [PriceHikeComponent, EditPriceHikeComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: PriceHikeComponent, pathMatch: 'full', data: { state: 'pricehike' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class PriceHikeModule { }