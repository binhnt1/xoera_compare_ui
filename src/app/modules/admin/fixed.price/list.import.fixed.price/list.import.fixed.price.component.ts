import { Component, Input, OnInit } from "@angular/core";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { FixedPriceEntity } from "../../../../_core/domains/entities/fixed.price.entity";

@Component({
    selector: 'list-import-fixed-price',
    styleUrls: ['list.import.fixed.price.component.scss'],
    templateUrl: 'list.import.fixed.price.component.html',
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
        this.loading = true;
    }

    async ngOnInit(): Promise<void> {
        let items = this.params && this.params['items'];
        if (items && items.length > 0) {
            this.loading = true;
            setTimeout(async () => {
                await this.render(this.obj, items);
                this.loading = false;
            }, 2000);
        }
    }
}