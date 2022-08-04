import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { AdminAuthGuard } from '../../../_core/guards/admin.auth.guard';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { NavigationStateData } from '../../../_core/domains/data/navigation.state';
import { PriceRuleEntity } from '../../../_core/domains/entities/price.rule.entity';
import { EditPriceRuleComponent } from './edit.price.rule/edit.price.rule.component';

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class PriceRuleComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        UpdatedBy: false,
        Size: ModalSizeType.Small,
        Reference: PriceRuleEntity,
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            { Property: 'Tariff', Type: DataType.String },
            { Property: 'Vehicle', Type: DataType.String },
            { Property: 'Rate', Type: DataType.Number },           
            { Property: 'Miles', Type: DataType.Number },           
        ];
        if (this.authen.management) {
            this.properties.splice(1, 0, { Property: 'Account', Type: DataType.String });
        }
        this.render(this.obj);
    }

    addNew() {
        let obj: NavigationStateData = {
            prevData: this.itemData,
            prevUrl: '/admin/pricerule',
        };
        this.router.navigate(['/admin/pricerule/add'], { state: { params: JSON.stringify(obj) } });
    }

    edit(item: PriceRuleEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevData: this.itemData,
            prevUrl: '/admin/pricerule',
        };
        this.router.navigate(['/admin/pricerule/edit'], { state: { params: JSON.stringify(obj) } });
    }

    view(item: PriceRuleEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            viewer: true,
            prevData: this.itemData,
            prevUrl: '/admin/pricerule',
        };
        this.router.navigate(['/admin/pricerule/view'], { state: { params: JSON.stringify(obj) } });
    }
}

@NgModule({
    declarations: [
        PriceRuleComponent,
        EditPriceRuleComponent
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: PriceRuleComponent, pathMatch: 'full', data: { state: 'pricerule' }, canActivate: [AdminAuthGuard] },
            { path: 'add', component: EditPriceRuleComponent, pathMatch: 'full', data: { state: 'add_pricerule'}, canActivate: [AdminAuthGuard] },
            { path: 'edit', component: EditPriceRuleComponent, pathMatch: 'full', data: { state: 'edit_pricerule'}, canActivate: [AdminAuthGuard] },
            { path: 'view', component: EditPriceRuleComponent, pathMatch: 'full', data: { state: 'view_pricerule'}, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class PriceRuleModule { }