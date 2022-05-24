import { Injectable } from '@angular/core';
import { ApiUrl } from '../../../_core/helpers/api.url.helper';
import { MethodType } from '../../../_core/domains/enums/method.type';
import { AdminApiService } from '../../../_core/services/admin.api.service';
import { BrokerLeadNoteEntity } from '../../../_core/domains/entities/broker.lead.note.entity';

@Injectable()
export class BrokerLeadService extends AdminApiService {  
    async addOrUpdateBrokerLeadNote(obj: BrokerLeadNoteEntity) {
        const api = ApiUrl.ToUrl('/admin/BrokerLeadNote/AddOrUpdate');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }     
    async brokerLeadNotes(id: number) {
        const api = ApiUrl.ToUrl('/admin/BrokerLeadNote/Items/' + id);
        return await this.ToResultApi(api, MethodType.Get);
    } 
}