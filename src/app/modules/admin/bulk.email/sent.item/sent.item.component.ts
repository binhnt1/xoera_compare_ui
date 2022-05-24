import { Component } from '@angular/core';
import { GridData } from '../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../../_core/components/grid/grid.component';
import { SentItemEntity } from '../../../../_core/domains/entities/sent.item.entity';

@Component({
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class SentItemComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        Actions: [],
        Features: [
            ActionData.reload(() => { this.loadItems(); })
        ],
        LastUpdatedBy: false,
        Size: ModalSizeType.Large,
        Reference: SentItemEntity,
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            { Property: 'Email', Type: DataType.String },
            { Property: 'Subject', Type: DataType.String },
            { Property: 'Source', Type: DataType.String },
            { Property: 'TimeSent', Type: DataType.DateTime, Align: 'center' }            
        ];
        this.render(this.obj);
    }
}