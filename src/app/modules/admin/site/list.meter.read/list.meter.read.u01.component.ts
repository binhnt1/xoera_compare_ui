import { GridData } from '../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { BaseEntity } from '../../../../_core/domains/entities/base.entity';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GridComponent } from '../../../../_core/components/grid/grid.component';
import { MeterReadEntity } from '../../../../_core/domains/entities/meter.read.entity';

@Component({
    selector: 'list-meter-read-u01',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class ListMeterReadU01Component extends GridComponent implements OnInit {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        Features: [
            ActionData.reload(() => this.loadItems())
        ],
        Actions: [],
        IsPopup: true,
        Radioable: true,
        HidePaging: true,
        HideSearch: true,
        LastUpdatedBy: false,
        HideHeadActions: true,
        HideCustomFilter: true,
        Reference: MeterReadEntity,
    };
    @Input() siteId: number;
    @Output() choiceChange: EventEmitter<number> = new EventEmitter<number>();

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Title: 'Choice', Type: DataType.String, Align: 'center' },
            { Property: 'SerialNumber', Title: 'Serial Number', Type: DataType.String },
            { Property: 'ReadDate', Title: 'Read Date', Type: DataType.String },
            { Property: 'Read', Title: 'Read', Type: DataType.String },
            { Property: 'RollCount', Title: 'Roll Count', Type: DataType.Number },
            {
                Property: 'MeterReadingReason', Title: 'Reason', Type: DataType.String,
                Format: (item: any) => {
                    let text: string = '';
                    if (item.MeterReadingReasonCode) text += item.MeterReadingReasonCode;
                    if (item.MeterReadingReason) text += ' - ' + item.MeterReadingReason;
                    return text;
                }
            },
            {
                Property: 'MeterReadingSource', Title: 'Source', Type: DataType.String,
                Format: (item: any) => {
                    let text: string = '';
                    if (item.MeterReadingSourceCode) text += item.MeterReadingSourceCode;
                    if (item.MeterReadingSource) text += ' - ' + item.MeterReadingSource;
                    return text;
                }
            },
            { Property: 'Status', Title: 'Status', Type: DataType.String },
            { Property: 'IsBilled', Title: 'Billed', Type: DataType.Boolean, Align: 'center' },
        ];
    }

    ngOnInit() {
        this.obj.Url = '/admin/meterRead/ItemsBySiteId/' + this.siteId;
        this.render(this.obj);
    }

    checkRadioChange(evt: any, item: BaseEntity) {
        this.items.forEach((itm: BaseEntity) => {
            itm.Checked = false;
        });
        item.Checked = evt.target.checked;
        if (item.Checked) this.choiceChange.emit(item.Id);
    }
}