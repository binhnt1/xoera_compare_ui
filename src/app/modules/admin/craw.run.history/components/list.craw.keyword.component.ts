import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { CrawKeywordEntity } from "../../../../_core/domains/entities/craw.keyword.entity";

@Component({
    selector: 'list-craw-keyword',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class ListCrawKeyWordComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Filters: [],
        Actions: [],
        Features: [],
        IsPopup: true,
        LastUpdatedBy: false,
        HideHeadActions: true,
        Reference: CrawKeywordEntity,
        Size: ModalSizeType.FullScreen,
    };
    @Input() params: any;
    @Output() choice: EventEmitter<CrawKeywordEntity> = new EventEmitter();

    constructor() {
        super();
        this.properties = [
            {
                Property: 'Name', Type: DataType.String,
                Click: ((obj: any) => {
                    this.choice.emit(obj);
                })
            },
            { Property: 'Count', Title: 'Count', Type: DataType.Number },
            { Property: 'LastRuning', Type: DataType.DateTime },
        ];
    }

    async ngOnInit() {
        let id = this.params && this.params['id'],
            domain = this.params && this.params['domain'];
        if (id && domain) {
            this.obj.Url = '/admin/CrawKeyWord/KeywordItems?runId=' + id + '&domain=' + domain;
            await this.render(this.obj);
        }
    }
}