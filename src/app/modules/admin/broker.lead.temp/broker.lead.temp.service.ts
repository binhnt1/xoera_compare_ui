import { Injectable } from '@angular/core';
import { ApiUrl } from '../../../_core/helpers/api.url.helper';
import { MethodType } from '../../../_core/domains/enums/method.type';
import { AdminApiService } from '../../../_core/services/admin.api.service';
import { BrokerLeadEntity } from '../../../_core/domains/entities/broker.lead.entity';

@Injectable()
export class BrokerLeadTempService extends AdminApiService {  
    async irrelevant(id: number) {
        const api = ApiUrl.ToUrl('/admin/brokerLeadTemp/irrelevant/' + id);
        return await this.ToResultApi(api, MethodType.Post);
    }
    async createBrokerLead(id: number, obj: BrokerLeadEntity) {
        const api = ApiUrl.ToUrl('/admin/brokerLeadTemp/createBrokerLead/' + id);
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
}