import { Component, Input, OnInit } from "@angular/core";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { BrokerLeadTempEntity } from "../../../../_core/domains/entities/broker.lead.temp.entity";

@Component({
    selector: 'list-broker-lead-temp',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class ListBrokerLeadTempComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Filters: [],
        Actions: [],
        Features: [],
        IsPopup: true,
        LastUpdatedBy: false,
        HideHeadActions: true,
        Size: ModalSizeType.FullScreen,
        Reference: BrokerLeadTempEntity,
    };
    @Input() params: any;

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            {
                Property: 'Name', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '';
                    if (item.Name) text += '<p>' + item.Name + '</p>';
                    if (item.OtherName) text += '<p>' + item.OtherName + '</p>';
                    return text;
                })
            },
            { Property: 'Owner', Type: DataType.String },
            {
                Property: 'Phone', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '';
                    if (item.Email) text += '<p>Email: ' + item.Email + '</p>';
                    if (item.Phone) text += '<p>Phone: ' + item.Phone + '</p>';
                    if (item.Mobile) text += '<p>Mobile: ' + item.Mobile + '</p>';
                    return text;
                })
            },
            { Property: 'Website', Type: DataType.String },
            { Property: 'Address', Type: DataType.String },
            {
                Property: 'Link', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '';
                    if (item.Domain) text += '<p>' + item.Domain + '</p>';
                    if (item.Link) text += '<p>' + item.Link + '</p>';
                    return text;
                })
            }
        ];
    }

    ngOnInit() {
        let id = this.params && this.params['id'];
        if (id) {
            this.obj.Url = '/admin/BrokerLeadTemp/Items/' + id;
        }
        this.render(this.obj);
    }
}