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
import { NavigationStateData } from '../../../_core/domains/data/navigation.state';

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
            { Property: 'Price', Type: DataType.String },
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
        let obj: NavigationStateData = {
            prevData: this.itemData,
            prevUrl: '/admin/price',
        };
        this.router.navigate(['/admin/price/add'], { state: { params: JSON.stringify(obj) } });
    }

    edit(item: PriceEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevData: this.itemData,
            prevUrl: '/admin/price',
        };
        this.router.navigate(['/admin/price/edit'], { state: { params: JSON.stringify(obj) } });
    }

    view(item: PriceEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            viewer: true,
            prevData: this.itemData,
            prevUrl: '/admin/price',
        };
        this.router.navigate(['/admin/price/view'], { state: { params: JSON.stringify(obj) } });
    }
}

@NgModule({
    declarations: [
        PriceComponent,
        EditPriceComponent
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: PriceComponent, pathMatch: 'full', data: { state: 'price' }, canActivate: [AdminAuthGuard] },
            { path: 'add', component: EditPriceComponent, pathMatch: 'full', data: { state: 'add_price'}, canActivate: [AdminAuthGuard] },
            { path: 'edit', component: EditPriceComponent, pathMatch: 'full', data: { state: 'edit_price'}, canActivate: [AdminAuthGuard] },
            { path: 'view', component: EditPriceComponent, pathMatch: 'full', data: { state: 'view_price'}, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class PriceModule { }