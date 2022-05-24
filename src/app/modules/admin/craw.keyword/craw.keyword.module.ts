import { RouterModule } from "@angular/router";
import { AppInjector } from "../../../app.module";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { CrawKeywordService } from "./craw.keyword.service";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ResultApi } from "../../../_core/domains/data/result.api";
import { ToastrHelper } from "../../../_core/helpers/toastr.helper";
import { OrderType } from "../../../_core/domains/enums/order.type";
import { ActionData } from "../../../_core/domains/data/action.data";
import { ActionType } from "../../../_core/domains/enums/action.type";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { NavigationStateData } from "../../../_core/domains/data/navigation.state";
import { CrawKeywordEntity } from "../../../_core/domains/entities/craw.keyword.entity";
import { ViewCrawKeywordComponent } from "./view.craw.keyword/view.craw.keyword.component";
import { CreateCrawKeywordComponent } from "./create.craw.keyword/create.craw.keyword.component";
import { ListBrokerLeadTempComponent } from "./list.broker.lead.temp/list.broker.lead.temp.component";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class CrawKeywordComponent extends GridComponent {
    obj: GridData = {
        Filters: [],
        Actions: [
            {
                icon: 'la la-play',
                name: ActionType.Enable,
                className: 'btn btn-warning',
                systemName: ActionType.Enable,
                hidden: ((item: any) => {
                    return item.Status == ActionType.Enable;
                }),
                click: (item: any) => {
                    this.toggle(item);
                }
            },
            {
                icon: 'la la-pause',
                name: ActionType.Disable,
                className: 'btn btn-warning',
                systemName: ActionType.Disable,
                hidden: ((item: any) => {
                    return item.Status == ActionType.Disable;
                }),
                click: (item: any) => {
                    this.toggle(item);
                }
            },
            ActionData.view((item: any) => this.view(item)),
            ActionData.edit((item: any) => this.edit(item)),
            ActionData.delete((item: any) => this.delete(item)),
        ],
        LastUpdatedBy: false,
        Reference: CrawKeywordEntity,
        Size: ModalSizeType.ExtraLarge,
    };
    crawKeywordService: CrawKeywordService;

    constructor() {
        super();
        this.crawKeywordService = AppInjector.get(CrawKeywordService);
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            { Property: 'Name', Type: DataType.String },
            { Property: 'Status', Type: DataType.DropDown, Align: 'center' },
            {
                Property: 'BrokerLeadCount', Title: 'Company', Type: DataType.Number, Align: 'center',
                Click: (item: any) => {
                    this.viewBrokerLeadTemp(item);
                }
            },
            { Property: 'LastLink', Type: DataType.String },
            { Property: 'LastRuning', Type: DataType.DateTime, Align: 'right' },
        ];
        this.itemData.Orders = this.itemData.Orders.filter(c => c.Name != 'LastRuning') || [];
        this.itemData.Orders.push({
            Name: 'LastRuning',
            Type: OrderType.Desc,
        });
        this.render(this.obj);
    }

    addNew() {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            confirmText: 'Submit',
            title: 'Create keyword',
            size: ModalSizeType.Small,
            object: CreateCrawKeywordComponent,
        }, async () => { this.loadItems(); });
    }

    edit(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            confirmText: 'Submit',
            title: 'Edit keyword',
            size: ModalSizeType.Small,
            objectExtra: { id: item.Id },
            object: CreateCrawKeywordComponent,
        }, async () => { this.loadItems(); });
    }

    view(item: any) {
        let obj: NavigationStateData = {
            id: item.Id,
            viewer: true,
            prevData: this.itemData,
            prevUrl: '/admin/crawkeyword',
        };
        this.router.navigate(['/admin/crawkeyword/view'], { state: { params: JSON.stringify(obj) } });
    }

    toggle(item: any) {
        let confirm = item.Status == 'Enable' ? 'Do you want disable keyword?' : 'Do you want enable keyword?';
        this.dialogService.ConfirmAsync(confirm, async () => {
            await this.crawKeywordService.toggle(item.Id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let message = item.Status == 'Enable' ? 'Disable keyword success' : 'Enable keyword success';
                    ToastrHelper.Success(message);
                    this.loadItems();
                } else ToastrHelper.ErrorResult(result);
            });
        });
    }

    viewBrokerLeadTemp(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            title: 'View company',
            objectExtra: { id: item.Id },
            size: ModalSizeType.ExtraLarge,
            object: ListBrokerLeadTempComponent,
        });
    }
}

@NgModule({
    declarations: [
        CrawKeywordComponent,
        ViewCrawKeywordComponent,
        CreateCrawKeywordComponent,
        ListBrokerLeadTempComponent
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: CrawKeywordComponent, pathMatch: 'full', data: { state: 'crawkeyword' }, canActivate: [AdminAuthGuard] },
            { path: 'view', component: ViewCrawKeywordComponent, pathMatch: 'full', data: { state: 'view_crawkeyword' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class CrawKeywordModule { }