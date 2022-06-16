import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { AdminAuthGuard } from '../../../_core/guards/admin.auth.guard';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { CompanyPartnerEntity } from '../../../_core/domains/entities/company.partner.entity';
import { AddCompanyPartnerComponent } from './add.company.partner/add.company.partner.component';
import { EditCompanyPartnerComponent } from './edit.company.partner/edit.company.partner.component';

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class CompanyPartnerComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        UpdatedBy: false,
        Size: ModalSizeType.Small,
        Reference: CompanyPartnerEntity,
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            { Property: 'Company', Type: DataType.String },
            { Property: 'Partner', Type: DataType.String },
            { Property: 'Accept', Type: DataType.Boolean },
            { Property: 'AcceptOn', Type: DataType.DateTime },
        ];
        this.render(this.obj);
    }

    addNew() {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            confirmText: 'Create',
            size: ModalSizeType.Medium,
            title: 'Create Company Partner',
            object: AddCompanyPartnerComponent,
        }, async () => {
            await this.loadItems();
        });
    }

    edit(item: CompanyPartnerEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            confirmText: 'Save',
            size: ModalSizeType.Medium,
            title: 'Edit Company Partner',
            object: EditCompanyPartnerComponent,
            objectExtra: {
                id: item.Id,
            }
        }, async () => {
            await this.loadItems();
        });
    }

    view(item: CompanyPartnerEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            size: ModalSizeType.Medium,
            title: 'View Company Partner',
            object: EditCompanyPartnerComponent,
            objectExtra: {
                id: item.Id,
                viewer: true,
            }
        });
    }
}

@NgModule({
    declarations: [CompanyPartnerComponent, EditCompanyPartnerComponent, AddCompanyPartnerComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: CompanyPartnerComponent, pathMatch: 'full', data: { state: 'companypartner' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class CompanyPartnerModule { }