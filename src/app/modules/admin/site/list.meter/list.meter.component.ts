import { GridData } from '../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { MeterEntity } from '../../../../_core/domains/entities/meter.entity';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GridComponent } from '../../../../_core/components/grid/grid.component';

@Component({
    selector: 'list-meter',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class ListMeterComponent extends GridComponent implements OnInit {
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
        Reference: MeterEntity,
    };
    @Input() meterPointId: number;
    @Output() selected: EventEmitter<MeterEntity> = new EventEmitter<MeterEntity>();

    constructor() {
        super();
        this.properties = [
            {
                Property: 'MeterSerialNumber', Title: 'Serial Number', Type: DataType.String,
                Click: (item: any) => {
                    this.selected.emit(item);
                }
            },
            { Property: 'MeterStatus', Title: 'Status', Type: DataType.String },
        ];
    }

    async ngOnInit() {
        this.obj.Url = '/admin/meter/Items/' + this.meterPointId;
        await this.render(this.obj);
        if (this.items && this.items.length > 0) {
            this.selected.emit(this.items[0] as MeterEntity);
        }
    }
}