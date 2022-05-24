import { Injectable } from '@angular/core';
import { ApiUrl } from '../../../_core/helpers/api.url.helper';
import { MethodType } from '../../../_core/domains/enums/method.type';
import { AdminApiService } from '../../../_core/services/admin.api.service';

@Injectable()
export class CrawWebsiteService extends AdminApiService {  
    async toggle(id: number) {
        const api = ApiUrl.ToUrl('/admin/crawWebsite/toggle/' + id);
        return await this.ToResultApi(api, MethodType.Post);
    }
    async loadItem(id: number) {
        const api = ApiUrl.ToUrl('/admin/crawWebsite/item/' + id);
        return await this.ToResultApi(api, MethodType.Get);
    }
}