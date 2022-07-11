import { Component, Input, OnInit } from "@angular/core";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { LicenceEntity } from "../../../../_core/domains/entities/licence.entity";

@Component({
    selector: 'list-licence',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class LicenceComponent extends GridComponent implements OnInit {
    @Input() items: LicenceEntity[];
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
        HideCustomFilter: true,
        Reference: LicenceEntity,
        Size: ModalSizeType.Small,
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            { Property: 'Type', Type: DataType.Number },
            { Property: 'DeviceId', Type: DataType.String },
            { Property: 'ClientKey', Type: DataType.String },
            { Property: 'DesktopClientKey', Type: DataType.String },
            { Property: 'MaximumDrivers', Type: DataType.Number },
            { Property: 'WhitelistIPs', Type: DataType.String },
        ];
    }

    ngOnInit(): void {
        if (this.items && this.items.length > 0)
            this.render(this.obj, this.items);
    }
}