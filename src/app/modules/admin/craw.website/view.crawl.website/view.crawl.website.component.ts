import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { CrawWebsiteService } from '../craw.website.service';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { ActionType } from '../../../../_core/domains/enums/action.type';
import { CrawRunningStatus } from '../../../../_core/domains/enums/craw.status';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { CrawWebsiteEntity } from '../../../../_core/domains/entities/craw.website.entity';

@Component({
    templateUrl: './view.crawl.website.component.html',
    styleUrls: ['./view.crawl.website.component.scss'],
})
export class ViewCrawWebsiteComponent extends EditComponent implements OnInit {
    id: number;
    @Input() params: any;
    loading: boolean = true;
    service: CrawWebsiteService;
    CrawRunningStatus = CrawRunningStatus;
    item: CrawWebsiteEntity = new CrawWebsiteEntity();

    constructor() {
        super();
        this.service = AppInjector.get(CrawWebsiteService);
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
    private async loadItem() {
        this.item = new CrawWebsiteEntity();
        if (this.id) {
            await this.service.loadItem(this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(CrawWebsiteEntity, result.Object as CrawWebsiteEntity);
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
        this.actions = await this.authen.actionsAllow(CrawWebsiteEntity, actions);
    }
}