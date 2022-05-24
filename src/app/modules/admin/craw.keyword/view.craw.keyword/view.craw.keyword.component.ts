import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { CrawKeywordService } from '../craw.keyword.service';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { CrawRunningStatus } from '../../../../_core/domains/enums/craw.status';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { CrawKeywordEntity } from '../../../../_core/domains/entities/craw.keyword.entity';

@Component({
    templateUrl: './view.craw.keyword.component.html',
    styleUrls: ['./view.craw.keyword.component.scss'],
})
export class ViewCrawKeywordComponent extends EditComponent implements OnInit {
    id: number;
    @Input() params: any;
    loading: boolean = true;
    service: CrawKeywordService;
    CrawRunningStatus = CrawRunningStatus;
    item: CrawKeywordEntity = new CrawKeywordEntity();

    constructor() {
        super();
        this.service = AppInjector.get(CrawKeywordService);
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
        this.item = new CrawKeywordEntity();
        if (this.id) {
            await this.service.item('CrawKeyword', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(CrawKeywordEntity, result.Object as CrawKeywordEntity);
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
        this.actions = await this.authen.actionsAllow(CrawKeywordEntity, actions);
    }
}