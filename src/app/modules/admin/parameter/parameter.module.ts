import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { AdminAuthGuard } from '../../../_core/guards/admin.auth.guard';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { ParameterEntity } from '../../../_core/domains/entities/parameter.entity';
import { EditParameterComponent } from './edit.parameter/edit.parameter.component';

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class ParameterComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        UpdatedBy: false,
        Size: ModalSizeType.Small,
        Reference: ParameterEntity,
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            { Property: 'Logo', Type: DataType.Image },
            { Property: 'DatabaseIp', Type: DataType.String },
            { Property: 'DbName', Type: DataType.String },
            { Property: 'DbUser', Type: DataType.String },
            { Property: 'RoutingEngineIp', Type: DataType.String },
            { Property: 'CustAppApiUrl', Type: DataType.String },
            { Property: 'DriversAppApiUrl', Type: DataType.String },
        ];
        this.render(this.obj);
    }

    addNew() {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            confirmText: 'Create',
            title: 'Create Parameter',
            size: ModalSizeType.Large,
            object: EditParameterComponent,
        }, async () => {
            await this.loadItems();
        });
    }

    edit(item: ParameterEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            confirmText: 'Save',
            title: 'Edit Parameter',
            size: ModalSizeType.Large,
            object: EditParameterComponent,
            objectExtra: {
                id: item.Id,
            }
        }, async () => {
            await this.loadItems();
        });
    }

    view(item: ParameterEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            title: 'View Parameter',
            size: ModalSizeType.Large,
            object: EditParameterComponent,
            objectExtra: {
                id: item.Id,
                viewer: true,
            }
        });
    }
}

@NgModule({
    declarations: [ParameterComponent, EditParameterComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: ParameterComponent, pathMatch: 'full', data: { state: 'parameter' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class ParameterModule { }