import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { CclEntity } from '../../../_core/domains/entities/ccl.entity';
import { AdminAuthGuard } from '../../../_core/guards/admin.auth.guard';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class CclComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        LastUpdatedBy: false,
        Reference: CclEntity,
        Size: ModalSizeType.Large,
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            { Property: 'Year', Type: DataType.String, Align: 'center' },
            {
                Property: 'Value', Type: DataType.Number, Align: 'right',
                Format: ((item: any) => {
                    return item.Value && item.Value.toLocaleString('en', { maximumFractionDigits: 3 });
                })
            },
            { Property: 'EffectiveFrom', Type: DataType.DateTime, Align: 'center' },
            { Property: 'EffectiveUltil', Type: DataType.DateTime, Align: 'center' }            
        ];
        this.render(this.obj);
    }
}

@NgModule({
    declarations: [CclComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: CclComponent, pathMatch: 'full', data: { state: 'ccl' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class CclModule { }