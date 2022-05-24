import { GridData } from "../../../../_core/domains/data/grid.data";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { BulkMailDto } from "../../../../_core/domains/objects/bulk.email.dto";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";

@Component({
    selector: 'list-contact',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class ListContactComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Filters: [],
        Actions: [],
        Features: [],
        IsPopup: true,
        Checkable: true,
        HidePaging: true,
        LastUpdatedBy: false,
        HideHeadActions: true,
        Reference: BulkMailDto,
        Size: ModalSizeType.Large,
    };
    @Input() params: any[];
    @Output() checkedChange: EventEmitter<any[]> = new EventEmitter();

    constructor() {
        super();
    }

    async ngOnInit() {        
        this.properties = this.params && this.params['properties'];
        let items = this.params && this.params['items'];
        await this.render(this.obj, items);
    }

    eventCheckChange(count: number) {
        let items = this.originalItems.filter(c => c.Checked);
        this.checkedChange.emit(items);
        console.log(count);
    }
}