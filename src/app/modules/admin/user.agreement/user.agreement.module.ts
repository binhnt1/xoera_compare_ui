import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { ActionData } from '../../../_core/domains/data/action.data';
import { AdminAuthGuard } from '../../../_core/guards/admin.auth.guard';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { UserAgreementEntity } from '../../../_core/domains/entities/user.agreement.entity';
import { EditUserAgreementComponent } from './edit.user.agreement/edit.user.agreement.component';

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class UserAgreementComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        UpdatedBy: false,
        Features: [            
            ActionData.reload(),
        ],
        Size: ModalSizeType.Small,
        Reference: UserAgreementEntity,
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

    edit(item: UserAgreementEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            confirmText: 'Save',
            title: 'Edit UserAgreement',
            size: ModalSizeType.ExtraLarge,
            object: EditUserAgreementComponent,
            objectExtra: {
                id: item.Id,
            }
        }, async () => {
            await this.loadItems();
        });
    }

    view(item: UserAgreementEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            title: 'View UserAgreement',
            size: ModalSizeType.ExtraLarge,
            object: EditUserAgreementComponent,
            objectExtra: {
                id: item.Id,
                viewer: true,
            }
        });
    }
}

@NgModule({
    declarations: [UserAgreementComponent, EditUserAgreementComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: UserAgreementComponent, pathMatch: 'full', data: { state: 'user.agreement' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class UserAgreementModule { }