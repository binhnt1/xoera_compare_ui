import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { HelpQuestionEntity } from '../../../../_core/domains/entities/question.entity';

@Component({
    templateUrl: './edit.help.question.component.html',
    styleUrls: [
        './edit.help.question.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditHelpQuestionComponent implements OnInit {
    viewer: boolean;
    @Input() params: any;
    loading: boolean = true;
    service: AdminApiService;
    item: HelpQuestionEntity = new HelpQuestionEntity();

    constructor() {
        this.service = AppInjector.get(AdminApiService);
    }

    ngOnInit() {
        this.loadItem();
        this.loading = false;
    }

    private async loadItem() {
        this.item = new HelpQuestionEntity();
        let id = this.params && this.params['id'];
        this.viewer = this.params && this.params['viewer'];
        if (id) {
            await this.service.item('helpquestion', id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(HelpQuestionEntity, result.Object as HelpQuestionEntity);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
    }

    public async confirm(): Promise<boolean> {
        if (this.item) {
            if (await validation(this.item)) {
                let obj: HelpQuestionEntity = _.cloneDeep(this.item);
                return await this.service.save('helpquestion', obj).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Save help question success');
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