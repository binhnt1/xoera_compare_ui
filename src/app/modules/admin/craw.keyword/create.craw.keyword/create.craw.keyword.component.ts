import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { CrawKeywordEntity } from '../../../../_core/domains/entities/craw.keyword.entity';

@Component({
    templateUrl: './create.craw.keyword.component.html',
    styleUrls: [
        './create.craw.keyword.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class CreateCrawKeywordComponent extends EditComponent implements OnInit {
    id: number;
    viewer: boolean;
    @Input() params: any;
    loading: boolean = true;
    service: AdminApiService;
    item: CrawKeywordEntity = new CrawKeywordEntity();

    constructor() {
        super();
        this.service = AppInjector.get(AdminApiService);
    }

    async ngOnInit() {
        this.id = this.params && this.params['id'];
        if (this.id) this.viewer = true;
        await this.loadItem();
        this.loading = false;
    }

    private async loadItem() {
        this.item = new CrawKeywordEntity();
        if (this.id) {
            await this.service.item('CrawKeyword', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(CrawKeywordEntity, result.Object);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
    }
    public async confirm(complete: () => void): Promise<boolean> {
        if (this.item) {
            if (await validation(this.item)) {
                let obj: CrawKeywordEntity = _.cloneDeep(this.item);
                return await this.service.save('CrawKeyword', obj).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Create keyword success');
                        if (complete) complete();
                        return true;
                    } else {
                        ToastrHelper.ErrorResult(result);
                        return false;
                    }
                }, () => {
                    return false;
                });
            }
        }
        return false;
    }
}