import { Component, Input, OnInit } from '@angular/core';
import { GridData } from '../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { GridComponent } from '../../../../_core/components/grid/grid.component';
import { MeterReadEntity } from '../../../../_core/domains/entities/meter.read.entity';

@Component({
    selector: 'list-meter-read',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class ListMeterReadComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        Features: [
            ActionData.reload(() => this.loadItems())
        ],
        Actions: [],
        IsPopup: true,
        HidePaging: true,
        HideSearch: true,
        LastUpdatedBy: false,
        HideHeadActions: true,
        HideCustomFilter: true,
        Reference: MeterReadEntity,
    };
    @Input() meterId: number;

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Title: 'Id', Type: DataType.Number },
            { Property: 'ReadDate', Title: 'Read Date', Type: DataType.String },
            { Property: 'Read', Title: 'Read', Type: DataType.String },
            { Property: 'RollCount', Title: 'Roll Count', Type: DataType.Number },
            { Property: 'MeterReadingReason', Title: 'Reason', Type: DataType.String },
            { Property: 'MeterReadingSource', Title: 'Source', Type: DataType.String },
            { Property: 'Status', Title: 'Status', Type: DataType.String },
            { Property: 'IsBilled', Title: 'Billed', Type: DataType.Boolean, Align: 'center' },
        ];
    }

    ngOnInit() {
        this.obj.Url = '/admin/meterRead/Items/' + this.meterId;
        this.render(this.obj);
    }
}