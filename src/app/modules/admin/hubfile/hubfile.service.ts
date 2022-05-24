import { Injectable } from '@angular/core';
import { ApiUrl } from '../../../_core/helpers/api.url.helper';
import { MethodType } from '../../../_core/domains/enums/method.type';
import { AdminApiService } from '../../../_core/services/admin.api.service';
import { UploadHubFileData } from '../../../_core/domains/entities/hubfile.entity';

@Injectable()
export class HubFileService extends AdminApiService {   
    async runNow() {
        const api = ApiUrl.ToUrl('/admin/HubFile/RunNow');
        return await this.ToResultApi(api, MethodType.Post);
    }
    async resetNodeTest() {
        const api = ApiUrl.ToUrl('/admin/HubFile/resetNodeTest');
        return await this.ToResultApi(api, MethodType.Post);
    }
    async resetNodeTest17() {
        const api = ApiUrl.ToUrl('/admin/HubFile/resetNodeTest17');
        return await this.ToResultApi(api, MethodType.Post);
    }
    async addNodeTest(nodeId: number) {
        const api = ApiUrl.ToUrl('/admin/HubFile/addNodeTest/' + nodeId);
        return await this.ToResultApi(api, MethodType.Post);
    }
    async loadNodeTest() {
        const api = ApiUrl.ToUrl('/admin/HubFile/loadNodeTest');
        return await this.ToResultApi(api, MethodType.Get);
    }
    async getDiagram() {
        const api = ApiUrl.ToUrl('/admin/HubFile/GetDiagram');
        return await this.ToResultApi(api, MethodType.Get);
    }
    async loadHubFileTree(id: number) {
        const api = ApiUrl.ToUrl('/admin/HubFile/LoadHubFileTree/' + id);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async loadHubFileTreeContent(content: string) {
        const api = ApiUrl.ToUrl('/admin/HubFile/LoadHubFileTree');
        return await this.ToResultApi(api, MethodType.Post, { Content: content });
    }
    async uploadFile(obj: UploadHubFileData) {
        const api = ApiUrl.ToUrl('/admin/HubFile/UploadFile/');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
}