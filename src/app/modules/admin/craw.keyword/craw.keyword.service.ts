import { Injectable } from '@angular/core';
import { ApiUrl } from '../../../_core/helpers/api.url.helper';
import { MethodType } from '../../../_core/domains/enums/method.type';
import { AdminApiService } from '../../../_core/services/admin.api.service';

@Injectable()
export class CrawKeywordService extends AdminApiService {  
    async toggle(id: number) {
        const api = ApiUrl.ToUrl('/admin/crawKeyword/toggle/' + id);
        return await this.ToResultApi(api, MethodType.Post);
    }
}