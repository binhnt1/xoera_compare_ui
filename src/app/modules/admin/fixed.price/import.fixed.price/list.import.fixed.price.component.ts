import { Component, Input, OnInit } from "@angular/core";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { FixedPriceEntity } from "../../../../_core/domains/entities/fixed.price.entity";

@Component({
    selector: 'list-import-fixed-price',
    templateUrl: '../../../../_core/components/grid/grid.lite.component.html',
})
export class ListImportFixedPriceComponent extends GridComponent implements OnInit {
    @Input() params: any;
    importItems: FixedPriceEntity[] = [];
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        Actions: [],
        Features: [],
        IsPopup: true,
        UpdatedBy: false,
        HidePaging: true,
        HideSearch: true,
        HideHeadActions: true,
        HideCustomFilter: true,
        Size: ModalSizeType.Small,
        Reference: FixedPriceEntity,        
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.String },
            { Property: 'Start', Type: DataType.String },
            { Property: 'End', Type: DataType.String },
            { Property: 'Price', Type: DataType.Number, Align: 'right' },
            { Property: 'Return', Type: DataType.Number, Align: 'right' },
            { Property: 'Drop', Type: DataType.Number, Align: 'right' },
            { Property: 'TariffId', Type: DataType.Number, Align: 'center' },
            { Property: 'VehTypeId', Type: DataType.Number, Align: 'center' },
            { Property: 'IsActive', Title: 'Active', Type: DataType.Boolean },
            { Property: 'ReverseDirection', Type: DataType.Boolean },
        ];
    }

    async ngOnInit(): Promise<void> {
        let items = this.params && this.params['items'];
        if (items && items.length > 0) {
            this.loading = true;
            await this.render(this.obj, items);
            this.loading = false;
        }
    }
}