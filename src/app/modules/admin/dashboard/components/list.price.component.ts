import { Component, Input, OnInit } from "@angular/core";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { PriceEntity } from "src/app/_core/domains/entities/price.entity";

@Component({
    selector: 'list-price',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class PriceComponent extends GridComponent implements OnInit {
    @Input() items: any[];
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        Actions: [],
        Features: [],
        IsPopup: true,
        UpdatedBy: false,
        HideSearch: true,
        HidePaging: true,
        HideHeadActions: true,
        Reference: PriceEntity,
        HideCustomFilter: true,
        Size: ModalSizeType.Small,
    };

    constructor() {
        super();
        this.properties = [
            {
                Property: 'Price', Type: DataType.Number, Align: 'center',
                Click: (item: any) => {
                    this.router.navigate(['/admin/price']);
                }
            },
            {
                Property: 'Tariff', Type: DataType.Number, Align: 'center',
                Click: (item: any) => {
                    this.router.navigate(['/admin/tariff']);
                }
            },
            {
                Property: 'PriceHike', Type: DataType.Number, Align: 'center',
                Click: (item: any) => {
                    this.router.navigate(['/admin/pricehike']);
                }
            },
            {
                Property: 'PriceRule', Type: DataType.Number, Align: 'center',
                Click: (item: any) => {
                    this.router.navigate(['/admin/pricerule']);
                }
            },
            {
                Property: 'FixedPrice', Type: DataType.Number, Align: 'center',
                Click: (item: any) => {
                    this.router.navigate(['/admin/fixedprice']);
                }
            },
            {
                Property: 'VehicleTypeMapping', Type: DataType.Number, Align: 'center',
                Click: (item: any) => {
                    this.router.navigate(['/admin/vehicletypemapping']);
                }
            },
        ];
    }

    ngOnInit(): void {
        if (this.items && this.items.length > 0)
            this.render(this.obj, this.items);
    }
}