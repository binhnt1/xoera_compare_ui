import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { AdminAuthGuard } from '../../../_core/guards/admin.auth.guard';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { AgreementEntity } from '../../../_core/domains/entities/agreement.entity';
import { EditAgreementComponent } from './edit.agreement/edit.agreement.component';

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class AgreementComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        UpdatedBy: false,
        Size: ModalSizeType.Small,
        Reference: AgreementEntity,
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            { Property: 'Name', Type: DataType.String },
            { Property: 'Binding', Type: DataType.Boolean },
            { Property: 'IssueDate', Type: DataType.DateTime },
            { Property: 'ExpiryDate', Type: DataType.DateTime },
            { Property: 'EffectiveFrom', Type: DataType.DateTime },
        ];
        this.render(this.obj);
    }

    addNew() {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            confirmText: 'Create',
            title: 'Create Agreement',
            size: ModalSizeType.ExtraLarge,
            object: EditAgreementComponent,
        }, async () => {
            await this.loadItems();
        });
    }

    edit(item: AgreementEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            confirmText: 'Save',
            title: 'Edit Agreement',
            size: ModalSizeType.ExtraLarge,
            object: EditAgreementComponent,
            objectExtra: {
                id: item.Id,
            }
        }, async () => {
            await this.loadItems();
        });
    }

    view(item: AgreementEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            title: 'View Agreement',
            size: ModalSizeType.ExtraLarge,
            object: EditAgreementComponent,
            objectExtra: {
                id: item.Id,
                viewer: true,
            }
        });
    }
}

@NgModule({
    declarations: [AgreementComponent, EditAgreementComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: AgreementComponent, pathMatch: 'full', data: { state: 'agreement' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class AgreementModule { }