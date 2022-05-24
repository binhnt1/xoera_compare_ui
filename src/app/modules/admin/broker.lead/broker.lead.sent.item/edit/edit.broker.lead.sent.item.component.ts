import * as _ from 'lodash';
import { AppInjector } from '../../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { validation } from '../../../../../_core/decorators/validator';
import { ResultApi } from '../../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../../_core/helpers/entity.helper';
import { AdminApiService } from '../../../../../_core/services/admin.api.service';
import { EditComponent } from '../../../../../_core/components/edit/edit.component';
import { SentItemEntity } from '../../../../../_core/domains/entities/sent.item.entity';

@Component({
    templateUrl: './edit.broker.lead.sent.item.component.html',
    styleUrls: [
        './edit.broker.lead.sent.item.component.scss',
        '../../../../../../assets/css/modal.scss'
    ],
})
export class EditBrokerLeadSentItemComponent extends EditComponent implements OnInit {
    id: number;
    viewer: boolean;
    brokerLeadId: number;
    @Input() params: any;
    item: SentItemEntity;
    loading: boolean = true;
    service: AdminApiService;

    constructor() {
        super();
        this.service = AppInjector.get(AdminApiService);
    }

    async ngOnInit() {
        this.brokerLeadId = this.params && this.params['brokerLeadId'];
        this.viewer = this.params && this.params['viewer'];
        this.id = this.params && this.params['id'];
        await this.loadItem();
        this.loading = false;
    }

    private async loadItem() {        
        if (this.id) {
            await this.service.item('SentItem', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(SentItemEntity, result.Object);
                    this.item.BrokerLeadId = this.brokerLeadId;
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        } else {
            this.item = new SentItemEntity();
            this.item.BrokerLeadId = this.brokerLeadId;
        }
    }
    public async confirm(complete: () => void): Promise<boolean> {
        if (this.item) {
            if (await validation(this.item)) {
                let obj: SentItemEntity = _.cloneDeep(this.item);
                return await this.service.save('SentItem', obj).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        let messsage = this.id
                            ? 'Save sent email success'
                            : 'Create sent email success';
                        ToastrHelper.Success(messsage);
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