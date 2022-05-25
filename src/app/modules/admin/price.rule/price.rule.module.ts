import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { UserType } from '../../../_core/domains/enums/user.type';
import { AdminAuthGuard } from '../../../_core/guards/admin.auth.guard';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
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
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            confirmText: 'Create',
            title: 'Create Price Rule',
            size: ModalSizeType.Small,
            object: EditPriceRuleComponent,
        }, async () => {
            await this.loadItems();
        });
    }

    edit(item: PriceRuleEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            confirmText: 'Save',
            title: 'Edit Price Rule',
            size: ModalSizeType.Small,
            object: EditPriceRuleComponent,
            objectExtra: {
                id: item.Id,
            }
        }, async () => {
            await this.loadItems();
        });
    }

    view(item: PriceRuleEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            title: 'View Price Rule',
            size: ModalSizeType.Small,
            object: EditPriceRuleComponent,
            objectExtra: {
                id: item.Id,
                viewer: true,
            }
        });
    }
}

@NgModule({
    declarations: [PriceRuleComponent, EditPriceRuleComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: PriceRuleComponent, pathMatch: 'full', data: { state: 'pricerule' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class PriceRuleModule { }