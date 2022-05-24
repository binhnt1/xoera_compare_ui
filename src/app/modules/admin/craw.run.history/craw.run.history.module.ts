import { RouterModule } from "@angular/router";
import { AppInjector } from "../../../app.module";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { CrawRunHistoryService } from "./craw.run.history.service";
import { ResultApi } from "../../../_core/domains/data/result.api";
import { ToastrHelper } from "../../../_core/helpers/toastr.helper";
import { ActionData } from "../../../_core/domains/data/action.data";
import { ActionType } from "../../../_core/domains/enums/action.type";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { NavigationStateData } from "../../../_core/domains/data/navigation.state";
import { ListCrawKeyWordComponent } from "./components/list.craw.keyword.component";
import { ListBrokerLeadTempComponent } from "./components/list.broker.lead.temp.component";
import { CrawRunHistoryEntity } from "../../../_core/domains/entities/craw.run.history.entity";
import { ViewCrawRunHistoryComponent } from "./view.crawl.run.history/view.crawl.run.history.component";
import { AdminShareModule } from "../admin.share.module";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class CrawRunHistoryComponent extends GridComponent {
    obj: GridData = {
        Filters: [],
        Actions: [
            {
                icon: 'la la-play',
                name: ActionType.Running,
                className: 'btn btn-warning',
                systemName: ActionType.Running,
                hidden: ((item: any) => {
                    return item.Status != ActionType.Pause;
                }),
                click: (item: any) => {
                    this.toggle(item);
                }
            },
            {
                icon: 'la la-pause',
                name: ActionType.Pause,
                className: 'btn btn-warning',
                systemName: ActionType.Pause,
                hidden: ((item: any) => {
                    return item.Status != ActionType.Running;
                }),
                click: (item: any) => {
                    this.toggle(item);
                }
            },
            ActionData.view((item: any) => this.view(item))
        ],
        Features: [
            ActionData.reload(() => this.loadItems())
        ],
        LastUpdatedBy: false,
        Size: ModalSizeType.ExtraLarge,
        Reference: CrawRunHistoryEntity,
    };
    crawRunHistoryService: CrawRunHistoryService;

    constructor() {
        super();
        this.crawRunHistoryService = AppInjector.get(CrawRunHistoryService);
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            { Property: 'Index', Type: DataType.Number },
            { Property: 'Status', Type: DataType.DropDown, Align: 'center' },
            { Property: 'RunTime', Type: DataType.DateTime, Align: 'center' },
            {
                Property: 'Reports', Type: DataType.String,
                Format: (item: any) => {
                    let text = '';
                    let reports: any[] = item.Reports;
                    if (reports && reports.length > 0) {
                        reports.forEach((report: any) => {
                            text += '<p>' + report.Domain + ': ' + report.Count + ' of ' + item.TotalKeyword + ' keywords</p>';
                        });
                    }
                    return text;
                }
            },
        ];
        this.render(this.obj);
    }

    toggle(item: any) {
        let confirm = item.Status == 'Running' ? 'Do you want pause thread?' : 'Do you want start thread?';
        this.dialogService.ConfirmAsync(confirm, async () => {
            await this.crawRunHistoryService.toggle(item.Id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let message = item.Status == 'Running' ? 'Pause thread success' : 'Start thread success';
                    ToastrHelper.Success(message);
                    this.loadItems();
                } else ToastrHelper.ErrorResult(result);
            });
        });
    }

    view(item: CrawRunHistoryEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            viewer: true,
            prevData: this.itemData,
            prevUrl: '/admin/crawrunhistory',
        };
        this.router.navigate(['/admin/crawrunhistory/view'], { state: { params: JSON.stringify(obj) } });
    }
}

@NgModule({
    declarations: [
        CrawRunHistoryComponent,
        ListCrawKeyWordComponent,
        ViewCrawRunHistoryComponent,
        ListBrokerLeadTempComponent,
    ],
    imports: [
        UtilityModule,
        AdminShareModule,
        RouterModule.forChild([
            { path: '', component: CrawRunHistoryComponent, pathMatch: 'full', data: { state: 'crawrunhistory' }, canActivate: [AdminAuthGuard] },
            { path: 'view', component: ViewCrawRunHistoryComponent, pathMatch: 'full', data: { state: 'view_crawrunhistory' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class CrawRunHistoryModule { }