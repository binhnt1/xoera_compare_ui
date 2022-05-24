import { RouterModule } from "@angular/router";
import { AppInjector } from "../../../app.module";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ResultApi } from "../../../_core/domains/data/result.api";
import { BrokerLeadTempService } from "./broker.lead.temp.service";
import { ActionType } from "../../../_core/domains/enums/action.type";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { EditBrokerLeadComponent } from "./create.broker.lead/create.broker.lead.component";
import { BrokerLeadTempEntity } from "../../../_core/domains/entities/broker.lead.temp.entity";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class BrokerLeadTempComponent extends GridComponent {
    obj: GridData = {
        Filters: [],
        Features: [],
        LastUpdatedBy: false,
        Size: ModalSizeType.FullScreen,
        Reference: BrokerLeadTempEntity,
        Actions: [
            {
                icon: 'la la-share-alt',
                name: 'Create Broker Lead',
                className: 'btn btn-primary',
                systemName: ActionType.AddNew,
                click: (item: any) => {
                    this.createBrokerLead(item);
                }
            },
            {
                icon: 'la la-close',
                name: 'Update Irrelevant',
                className: 'btn btn-warning',
                systemName: ActionType.Disable,
                click: (item: any) => {
                    this.irrelevant(item);
                }
            }
        ],
        CustomFilters: ['Irrelevant', 'BrokerLeadCreated'],
    };
    service: BrokerLeadTempService;

    constructor() {
        super();
        this.service = AppInjector.get(BrokerLeadTempService);
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
            {
                Property: 'Website', Type: DataType.String,
                Format: ((item: any) => {
                    return item.Website 
                        ? '<a target="_blank" href="' + item.Website + '">' + item.Website + '</a>'
                        : null;
                })
            },
            { Property: 'Address', Type: DataType.String },
            {
                Property: 'Link', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '';
                    if (item.Domain) text += '<p>' + item.Domain + '</p>';
                    if (item.Link) text += '<p><a target="_blank" href="' + item.Link + '">' + item.Link + '</a></p>';
                    return text;
                })
            },
            { Property: 'Irrelevant', Type: DataType.String, Align: 'center' },
            { Property: 'BrokerLeadCreated', Type: DataType.String, Align: 'center' },
        ];
        this.render(this.obj);
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
}

@NgModule({
    declarations: [
        BrokerLeadTempComponent
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: BrokerLeadTempComponent, pathMatch: 'full', data: { state: 'brokerleadtemp' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class BrokerLeadTempModule { }