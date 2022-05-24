import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { BrokerLeadTempService } from '../broker.lead.temp.service';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { BrokerLeadEntity } from '../../../../_core/domains/entities/broker.lead.entity';
import { BrokerLeadTempEntity } from '../../../../_core/domains/entities/broker.lead.temp.entity';

@Component({
    templateUrl: './create.broker.lead.component.html',
    styleUrls: [
        './create.broker.lead.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditBrokerLeadComponent extends EditComponent implements OnInit {
    id: number;
    popup: boolean;
    viewer: boolean;
    @Input() params: any;
    loading: boolean = true;
    tab: string = 'templateHtml';
    service: BrokerLeadTempService;
    itemTemp: BrokerLeadTempEntity;
    loadingTemplate: boolean = false;
    item: BrokerLeadEntity = new BrokerLeadEntity();

    constructor() {
        super();
        this.service = AppInjector.get(BrokerLeadTempService);
        this.state = this.getUrlState();
    }

    async ngOnInit() {
        this.id = this.params && this.params['id'];
        await this.loadItem();
        this.loading = false;
    }

    private async loadItem() {
        this.item = new BrokerLeadEntity();
        if (this.id) {
            await this.service.item('brokerleadtemp', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.itemTemp = EntityHelper.createEntity(BrokerLeadTempEntity, result.Object);
                    if (this.itemTemp) {
                        this.item.Active = true;
                        this.item.Deleted = false;
                        let phone = this.itemTemp.Phone;
                        if (phone) {
                            while (phone.indexOf(' ') >= 0)
                                phone = phone.replace(' ', '');
                            this.item.Phone1 = phone;
                        }
                        let mobile = this.itemTemp.Mobile;
                        if (mobile) {
                            while (mobile.indexOf(' ') >= 0)
                                mobile = mobile.replace(' ', '');
                            this.item.Mobile1 = mobile;
                        }
                        this.item.Email1 = this.itemTemp.Email;
                        this.item.Website = this.itemTemp.Website;
                        this.item.Address = this.itemTemp.Address;
                        this.item.ContactName = this.itemTemp.Owner;
                        this.item.BusinessName = this.itemTemp.Name;
                    }
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
    }
    public async confirm(complete: () => void): Promise<boolean> {
        if (this.item) {
            if (await validation(this.item)) {
                let obj: BrokerLeadEntity = _.cloneDeep(this.item);
                return await this.service.createBrokerLead(this.itemTemp.Id, obj).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Create broker lead success');
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