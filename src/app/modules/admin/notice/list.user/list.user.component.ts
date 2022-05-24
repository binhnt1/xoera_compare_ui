import { GridData } from '../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserEntity } from '../../../../_core/domains/entities/user.entity';
import { GridComponent } from '../../../../_core/components/grid/grid.component';

@Component({
    selector: 'list-user',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class ListUserComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        Actions: [],
        Features: [],
        IsPopup: true,
        Checkable: true,
        HidePaging: true,
        HideSearch: true,
        LastUpdatedBy: false,
        Reference: UserEntity,
        HideHeadActions: true,
        HideCustomFilter: true,
    };
    @Input() ids: number[];
    @Output() selectedChange: EventEmitter<number[]> = new EventEmitter<number[]>();

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Title: 'User Id', Type: DataType.Number },
            { Property: 'Email', Title: 'User Name', Type: DataType.String },
            { Property: 'FullName', Title: 'Full Name', Type: DataType.String },
            { Property: 'UserType', Title: 'User Type', Type: DataType.String },
            { Property: 'LastLogin', Title: 'Last Login', Type: DataType.DateTime },
        ];
    }

    ngOnInit() {
        this.obj.Url = '/admin/Notice/AccountItems';
        this.selectedIds = this.ids;
        this.render(this.obj);
    }

    eventCheckChange(count: number) {
        if (!count) {
            this.selectedChange.emit(null);
        }
        this.selectedChange.emit(this.selectedIds);
    }
}