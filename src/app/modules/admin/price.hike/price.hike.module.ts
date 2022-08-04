import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { AdminAuthGuard } from '../../../_core/guards/admin.auth.guard';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { NavigationStateData } from '../../../_core/domains/data/navigation.state';
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
        let obj: NavigationStateData = {
            prevData: this.itemData,
            prevUrl: '/admin/pricehike',
        };
        this.router.navigate(['/admin/pricehike/add'], { state: { params: JSON.stringify(obj) } });
    }

    edit(item: PriceHikeEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevData: this.itemData,
            prevUrl: '/admin/pricehike',
        };
        this.router.navigate(['/admin/pricehike/edit'], { state: { params: JSON.stringify(obj) } });
    }

    view(item: PriceHikeEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            viewer: true,
            prevData: this.itemData,
            prevUrl: '/admin/pricehike',
        };
        this.router.navigate(['/admin/pricehike/view'], { state: { params: JSON.stringify(obj) } });
    }
}

@NgModule({
    declarations: [
        PriceHikeComponent,
        EditPriceHikeComponent
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: PriceHikeComponent, pathMatch: 'full', data: { state: 'pricehike' }, canActivate: [AdminAuthGuard] },
            { path: 'add', component: EditPriceHikeComponent, pathMatch: 'full', data: { state: 'add_pricehike'}, canActivate: [AdminAuthGuard] },
            { path: 'edit', component: EditPriceHikeComponent, pathMatch: 'full', data: { state: 'edit_pricehike'}, canActivate: [AdminAuthGuard] },
            { path: 'view', component: EditPriceHikeComponent, pathMatch: 'full', data: { state: 'view_pricehike'}, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class PriceHikeModule { }