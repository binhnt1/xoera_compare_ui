import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { AdminAuthGuard } from '../../../_core/guards/admin.auth.guard';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { ConsumptionCurveEntity } from '../../../_core/domains/entities/consumption.curve.entity';

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class ConsumptionCurveComponent extends GridComponent {
    obj: GridData = {
        LastUpdatedBy: false,
        Reference: ConsumptionCurveEntity,
        Size: ModalSizeType.Large,
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            { Property: 'Year', Type: DataType.String, Align: 'center' },
            { Property: 'Month', Type: DataType.String, Align: 'center' },
            { Property: 'MonthValue', Type: DataType.String, Align: 'center' },
            {
                Property: 'Usage', Type: DataType.Number, Align: 'right',
                Format: ((item: any) => {
                    return item.Usage && item.Usage.toLocaleString('en', { maximumFractionDigits: 2 });
                })
            },
        ];
        this.render(this.obj);
    }
}

@NgModule({
    declarations: [ConsumptionCurveComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: ConsumptionCurveComponent, pathMatch: 'full', data: { state: 'consumption-curve' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class ConsumptionCurveModule { }