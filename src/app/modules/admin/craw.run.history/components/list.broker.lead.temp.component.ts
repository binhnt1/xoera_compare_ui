import { AppInjector } from "../../../../app.module";
import { Component, Input, OnInit } from "@angular/core";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { CrawRunHistoryService } from "../craw.run.history.service";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { ResultApi } from "../../../../_core/domains/data/result.api";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { BrokerLeadTempEntity } from "../../../../_core/domains/entities/broker.lead.temp.entity";
import { EditBrokerLeadComponent } from "../../broker.lead.temp/create.broker.lead/create.broker.lead.component";

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
        HideSearch: true,
        LastUpdatedBy: false,
        HideHeadActions: true,
        Size: ModalSizeType.FullScreen,
        Reference: BrokerLeadTempEntity,
    };
    @Input() params: any;
    service: CrawRunHistoryService;

    constructor() {
        super();
        this.service = AppInjector.get(CrawRunHistoryService);
        this.properties = [
            {
                Property: 'Name', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '';
                    if (item.Name) text += '<p>' + item.Name + '</p>';
                    if (item.OtherName) text += '<p>' + item.OtherName + '</p>';
                    if (item.Owner) text += '<p>Owner: ' + item.Owner + '</p>';
                    if (item.Domain && item.Link) text += '<p><a target="_blank" href="' + item.Link + '">' + item.Domain + '</a></p>';
                    return text;
                })
            },
            {
                Property: 'Phone', Title: 'Information', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '';
                    if (item.Email) text += '<div>Email: ' + item.Email + '</div>';
                    if (item.Phone) text += '<div>Phone: ' + item.Phone + '</div>';
                    if (item.Mobile) text += '<div>Mobile: ' + item.Mobile + '</div>';
                    if (item.Website) text += '<div>Website: <a target="_blank" href="' + item.Website + '">' + item.Website + '</a></div>';
                    if (item.Address) text += '<div>Address: ' + item.Address + '</div>';
                    return text;
                })
            },
            { Property: 'Irrelevant', Type: DataType.String, Align: 'center' },
            { Property: 'BrokerLeadCreated', Type: DataType.String, Align: 'center' },
        ];
    }

    ngOnInit() {
        let id = this.params && this.params['id'];
        if (id) {
            this.obj.Url = '/admin/BrokerLeadTemp/Items/' + id;
            this.render(this.obj);
        }
    }

    irrelevant(item: any) {
        this.dialogService.ConfirmAsync('Do you want update irrelevant for this item?', async () => {
            await this.service.irrelevant(item.Id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.loadItems();
                }
            })
        })
    }

    createBrokerLead(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            confirmText: 'Submit',
            size: ModalSizeType.Large,
            title: 'Create broker lead',
            objectExtra: { id: item.Id },
            object: EditBrokerLeadComponent,
        }, async () => { this.loadItems(); });
    }

    quickView(item: any, type: string) {
        let originalItem: any = this.originalItems.find(c => c.Id == item.Id);
        if (originalItem) {
            switch (type) {
                case 'link': {
                    let url = originalItem.Link;
                    window.open(url, "_blank");
                } break;
            }
        }
    }
}