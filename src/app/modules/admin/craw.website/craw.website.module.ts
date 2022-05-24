import { RouterModule } from "@angular/router";
import { AppInjector } from "../../../app.module";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { CrawWebsiteService } from "./craw.website.service";
import { GridData } from "../../../_core/domains/data/grid.data";
import { DataType } from "../../../_core/domains/enums/data.type";
import { ResultApi } from "../../../_core/domains/data/result.api";
import { ToastrHelper } from "../../../_core/helpers/toastr.helper";
import { ActionData } from "../../../_core/domains/data/action.data";
import { ActionType } from "../../../_core/domains/enums/action.type";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { ModalSizeType } from "../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../_core/components/grid/grid.component";
import { NavigationStateData } from "../../../_core/domains/data/navigation.state";
import { CrawWebsiteEntity } from "../../../_core/domains/entities/craw.website.entity";
import { ViewCrawWebsiteComponent } from "./view.crawl.website/view.crawl.website.component";
import { CreateCrawWebsiteComponent } from "./create.craw.website/create.craw.website.component";

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class CrawWebsiteComponent extends GridComponent {
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
        Reference: CrawWebsiteEntity,
        Size: ModalSizeType.ExtraLarge,
    };
    crawWebsiteService: CrawWebsiteService;

    constructor() {
        super();
        this.crawWebsiteService = AppInjector.get(CrawWebsiteService);
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            { Property: 'Domain', Type: DataType.String },
            { Property: 'Status', Type: DataType.DropDown, Align: 'center' },
            { Property: 'DelayTime', Type: DataType.Number, Align: 'right' },
            { Property: 'LastLink', Type: DataType.String },
            { Property: 'LastRuning', Type: DataType.DateTime, Align: 'right' },
        ];
        this.render(this.obj);
    }

    addNew() {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            confirmText: 'Submit',
            title: 'Create website',
            size: ModalSizeType.Large,
            object: CreateCrawWebsiteComponent,
        }, async () => { this.loadItems(); });
    }

    edit(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            confirmText: 'Submit',
            title: 'Edit website',
            size: ModalSizeType.Large,
            objectExtra: { id: item.Id },
            object: CreateCrawWebsiteComponent,
        }, async () => { this.loadItems(); });
    }

    view(item: any) {
        let obj: NavigationStateData = {
            id: item.Id,
            viewer: true,
            prevData: this.itemData,
            prevUrl: '/admin/crawwebsite',
        };
        this.router.navigate(['/admin/crawwebsite/view'], { state: { params: JSON.stringify(obj) } });
    }

    toggle(item: any) {
        let confirm = item.Status == 'Enable' ? 'Do you want disable website?' : 'Do you want enable website?';
        this.dialogService.ConfirmAsync(confirm, async () => {
            await this.crawWebsiteService.toggle(item.Id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let message = item.Status == 'Enable' ? 'Disable website success' : 'Enable website success';
                    ToastrHelper.Success(message);
                    this.loadItems();
                } else ToastrHelper.ErrorResult(result);
            });
        });
    }
}

@NgModule({
    declarations: [
        CrawWebsiteComponent,
        ViewCrawWebsiteComponent,
        CreateCrawWebsiteComponent
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: CrawWebsiteComponent, pathMatch: 'full', data: { state: 'crawwebsite' }, canActivate: [AdminAuthGuard] },
            { path: 'view', component: ViewCrawWebsiteComponent, pathMatch: 'full', data: { state: 'view_crawwebsite' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class CrawWebsiteModule { }