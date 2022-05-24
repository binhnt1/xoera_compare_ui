import { Component } from '@angular/core';
import { GridData } from '../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../../_core/components/grid/grid.component';
import { EmailLogEntity } from '../../../../_core/domains/entities/email.log.entity';

@Component({
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class EmailLogComponent extends GridComponent {
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
        Reference: EmailLogEntity,
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            { Property: 'Smtpuser', Type: DataType.String },
            { Property: 'EmailFrom', Type: DataType.String },
            { Property: 'EmailTo', Type: DataType.String },
            { Property: 'Subject', Type: DataType.String },
            { Property: 'CreatedAt', Title: 'Time', Type: DataType.DateTime, Align: 'center' },          
            { Property: 'ErrorMessage', Type: DataType.String },
        ];
        this.render(this.obj);
    }
}