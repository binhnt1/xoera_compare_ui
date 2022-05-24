import { Injectable } from '@angular/core';
import { ApiUrl } from '../../../_core/helpers/api.url.helper';
import { MethodType } from '../../../_core/domains/enums/method.type';
import { AdminApiService } from '../../../_core/services/admin.api.service';

@Injectable()
export class CrawRunHistoryService extends AdminApiService {  
    async toggle(id: number) {
        const api = ApiUrl.ToUrl('/admin/crawRunHistory/toggle/' + id);
        return await this.ToResultApi(api, MethodType.Post);
    }
    async loadItem(id: number) {
        const api = ApiUrl.ToUrl('/admin/crawRunHistory/item/' + id);
        return await this.ToResultApi(api, MethodType.Get);
    }    
    async loadKeywords(id: number, domain: string) {
        const api = ApiUrl.ToUrl('/admin/CrawKeyword/Items?runId=' + id + '&domain=' + domain);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async irrelevant(id: number) {
        const api = ApiUrl.ToUrl('/admin/brokerLeadTemp/irrelevant/' + id);
        return await this.ToResultApi(api, MethodType.Post);
    }
}