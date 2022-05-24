import { GridData } from '../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { MprnEntity } from '../../../../_core/domains/entities/mprn.entity';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GridComponent } from '../../../../_core/components/grid/grid.component';

@Component({
    selector: 'list-mprn',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class ListMprnComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        Features: [
            ActionData.reload(() => this.loadItems())
        ],
        Actions: [],
        IsPopup: true,
        LastUpdatedBy: false,
        Reference: MprnEntity,
        SearchText: 'Search Mprn...'
    };
    @Input() siteId: number;
    @Output() selectedChange: EventEmitter<MprnEntity> = new EventEmitter<MprnEntity>();

    constructor() {
        super();
        this.properties = [
            {
                Property: 'Mprn1', Title: 'Mprn', Type: DataType.String,
                Click: ((item: any) => {
                    let obj = this.originalItems.find(c => c.Id == item.Id) as MprnEntity;
                    this.selectedChange.emit(obj);
                })
            },
            {
                Property: 'Column6', Title: 'Unit Flat Company Name', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '';
                    if (item.Column6) text += '<p>Name 1: ' + item.Column6;
                    if (item.Column7) text += '<p>Name 2: ' + item.Column7;
                    if (item.Column8) text += '<p>Name 3: ' + item.Column8;
                    return text;
                })
            },
            {
                Property: 'Column10', Title: 'Building', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '';
                    if (item.Column10) text += '<p>Building Name: ' + item.Column10;
                    if (item.Column9) text += '<p>Building Number: ' + item.Column9;
                    if (item.Column11) text += '<p>Street: ' + item.Column11;
                    if (item.Column14) text += '<p>PostTown: ' + item.Column14;
                    if (item.Column15) text += '<p>Area: ' + item.Column15;
                    if (item.Outcode || item.Incode) text += '<p>Post Code: ' + item.Outcode + ' ' + item.Incode;
                    return text;
                })
            },
            {
                Property: 'Column12', Title: 'Locality', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '';
                    if (item.Column12) text += '<p>Locality 1: ' + item.Column12;
                    if (item.Column13) text += '<p>Locality 2: ' + item.Column13;
                    return text;
                })
            },
        ];
    }

    ngOnInit() {
        this.render(this.obj);
    }
}