import { Injectable } from '@angular/core';
import { ApiUrl } from '../../../_core/helpers/api.url.helper';
import { SiteDto } from '../../../_core/domains/objects/site.dto';
import { MethodType } from '../../../_core/domains/enums/method.type';
import { AdminApiService } from '../../../_core/services/admin.api.service';

@Injectable()
export class SiteService extends AdminApiService {  
    async createSite(obj: SiteDto) {
        const api = ApiUrl.ToUrl('/admin/site/addnew');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
    async prevCheckNode(nodeId: number, siteId: number) {
        const api = ApiUrl.ToUrl('/admin/hubfile/prevCheckNode?nodeId=' + nodeId + '&siteId=' + siteId);
        return await this.ToResultApi(api, MethodType.Post);
    }
    async createNode(nodeId: number, siteId: number, obj: any = null, save: boolean = true) {
        const api = ApiUrl.ToUrl('/admin/hubfile/createNode?nodeId=' + nodeId + '&siteId=' + siteId + '&save=' + save);
        return await this.ToResultApi(api, MethodType.Post, obj || {});
    }
    async uploadHubFile(id: number) {
        const api = ApiUrl.ToUrl('/admin/hubfile/upload/' + id);
        return await this.ToResultApi(api, MethodType.Post);
    }
    async reTryCreateNode(id: number) {
        const api = ApiUrl.ToUrl('/admin/hubfile/reTryCreateNode/' + id);
        return await this.ToResultApi(api, MethodType.Post);
    }
    async reTry(id: number) {
        const api = ApiUrl.ToUrl('/admin/hubfile/reTry/' + id);
        return await this.ToResultApi(api, MethodType.Post);
    }
    async loadNodes(siteId: number) {
        const api = ApiUrl.ToUrl('/admin/hubfile/loadNodes?siteId=' + siteId);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async loadMeterPoint(siteId: number) {
        const api = ApiUrl.ToUrl('/admin/meterPoint/ItemBySiteId/' + siteId);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async getMeterReadForC41(id: number) {
        const api = ApiUrl.ToUrl('/admin/meterRead/item/' + id);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async loadMeterLI(siteId: number) {
        const api = ApiUrl.ToUrl('/admin/meter/itemBySiteId/' + siteId);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async loadMeterRE(siteId: number) {
        const api = ApiUrl.ToUrl('/admin/meter/ItemREBySiteId/' + siteId);
        return await this.ToResultApi(api, MethodType.Get);
    }
}