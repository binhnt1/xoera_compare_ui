import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { CrawRunHistoryService } from '../craw.run.history.service';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { ActionType } from '../../../../_core/domains/enums/action.type';
import { CrawRunningStatus } from '../../../../_core/domains/enums/craw.status';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { CrawRunHistoryEntity } from '../../../../_core/domains/entities/craw.run.history.entity';

@Component({
    templateUrl: './view.crawl.run.history.component.html',
    styleUrls: ['./view.crawl.run.history.component.scss'],
})
export class ViewCrawRunHistoryComponent extends EditComponent implements OnInit {
    id: number;
    keyword: any;
    website: any;
    keywords: any[];
    @Input() params: any;
    domainKeyword: number;
    loading: boolean = true;
    service: CrawRunHistoryService;
    CrawRunningStatus = CrawRunningStatus;
    item: CrawRunHistoryEntity = new CrawRunHistoryEntity();

    constructor() {
        super();
        this.service = AppInjector.get(CrawRunHistoryService);
        this.state = this.getUrlState();
    }

    async ngOnInit() {
        this.id = this.params && this.params['id'];
        if (this.state) {
            this.id = this.state.id;
            this.addBreadcrumb(this.id ? 'View' : 'Add');
        }
        await this.loadItem();
        this.renderActions();
        this.loading = false;
    }

    toggle(item: any) {
        let confirm = item.Status == 'Running' ? 'Do you want pause thread?' : 'Do you want start thread?';
        this.dialogService.ConfirmAsync(confirm, async () => {
            await this.service.toggle(item.Id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let message = item.Status == 'Running' ? 'Pause thread success' : 'Start thread success';
                    ToastrHelper.Success(message);
                    this.loadItem();
                } else ToastrHelper.ErrorResult(result);
            });
        });
    }
    viewKeywords(website: any) {
        this.keyword = null;
        this.website = null;
        setTimeout(() => {
            this.website = website;
        }, 300);
    }
    viewBrokerLeadTemps(keyword: any) {
        this.keyword = null;
        setTimeout(() => {
            this.keyword = keyword;
        }, 300);
    }

    private async loadItem() {
        this.item = new CrawRunHistoryEntity();
        if (this.id) {
            await this.service.loadItem(this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(CrawRunHistoryEntity, result.Object as CrawRunHistoryEntity);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
    }
    private async renderActions() {
        let actions: ActionData[] = [
            ActionData.back(() => { this.back() }),
        ];
        if (this.item.Status == CrawRunningStatus.Pause) {
            actions.push({
                icon: 'la la-play',
                name: ActionType.Running,
                className: 'btn btn-warning',
                systemName: ActionType.Running,
                click: (item: any) => {
                    this.toggle(item);
                }
            })
        }
        if (this.item.Status == CrawRunningStatus.Running) {
            actions.push({
                icon: 'la la-pause',
                name: ActionType.Pause,
                className: 'btn btn-warning',
                systemName: ActionType.Pause,
                click: (item: any) => {
                    this.toggle(item);
                }
            });
        }
        this.actions = await this.authen.actionsAllow(CrawRunHistoryEntity, actions);
    }
}