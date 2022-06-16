import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { EditLicenceComponent } from './edit.licence/edit.licence.component';
import { AdminAuthGuard } from '../../../_core/guards/admin.auth.guard';
import { LicenceEntity } from '../../../_core/domains/entities/licence.entity';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class LicenceComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        UpdatedBy: false,
        Size: ModalSizeType.Small,
        Reference: LicenceEntity,
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            { Property: 'Company', Type: DataType.String },
            { Property: 'Type', Type: DataType.Number },           
            { Property: 'DeviceId', Type: DataType.String },
            { Property: 'ClientKey', Type: DataType.String },           
            { Property: 'DesktopClientKey', Type: DataType.String },       
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
            title: 'Create Licence',
            size: ModalSizeType.Large,
            object: EditLicenceComponent,
        }, async () => {
            await this.loadItems();
        });
    }

    edit(item: LicenceEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            confirmText: 'Save',
            title: 'Edit Licence',
            size: ModalSizeType.Large,
            object: EditLicenceComponent,
            objectExtra: {
                id: item.Id,
            }
        }, async () => {
            await this.loadItems();
        });
    }

    view(item: LicenceEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            title: 'View Licence',
            size: ModalSizeType.Large,
            object: EditLicenceComponent,
            objectExtra: {
                id: item.Id,
                viewer: true,
            }
        });
    }
}

@NgModule({
    declarations: [LicenceComponent, EditLicenceComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: LicenceComponent, pathMatch: 'full', data: { state: 'licence' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class LicenceModule { }