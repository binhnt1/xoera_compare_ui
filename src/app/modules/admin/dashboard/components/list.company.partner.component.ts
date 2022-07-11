import { Component, Input, OnInit } from "@angular/core";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { ActionType } from "../../../../_core/domains/enums/action.type";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { CompanyPartnerEntity } from "../../../../_core/domains/entities/company.partner.entity";
import { AddCompanyPartnerComponent } from "../add.company.partner/add.company.partner.component";

@Component({
    selector: 'list-company-partner',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class ListCompanyPartnerComponent extends GridComponent implements OnInit {
    @Input() items: CompanyPartnerEntity[];
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        Actions: [],
        IsPopup: true,
        UpdatedBy: false,
        HideSearch: true,
        HidePaging: true,
        Title: 'Partners',
        Features: [{
            icon: 'la la-plus',
            name: ActionType.AddNew,
            className: 'btn btn-primary',
            systemName: ActionType.Empty,
            click: () => {
                this.addNew();
            }
        }],
        HideCustomFilter: true,
        Size: ModalSizeType.Small,
        Reference: CompanyPartnerEntity,
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Partner', Type: DataType.String },
            { Property: 'Accept', Type: DataType.Boolean },
            { Property: 'AcceptOn', Type: DataType.DateTime },
        ];
    }

    ngOnInit(): void {
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
}