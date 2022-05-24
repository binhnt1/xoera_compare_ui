import { Injectable } from '@angular/core';
import { ApiUrl } from '../../../_core/helpers/api.url.helper';
import { MethodType } from '../../../_core/domains/enums/method.type';
import { AdminApiService } from '../../../_core/services/admin.api.service';
import { AgencyEntity } from '../../../_core/domains/entities/broker.entity';
import { AgencyNoteEntity } from '../../../_core/domains/entities/broker.note.entity';
import { AgencyDocumentEntity } from '../../../_core/domains/entities/broker.document.entity';
import { HttpHeaders, HttpRequest } from '@angular/common/http';

@Injectable()
export class BrokerService extends AdminApiService {  
    async brokerPermissions(id: number) {
        const api = ApiUrl.ToUrl('/admin/Agency/Permissions/' + id);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async addOrUpdate(obj: AgencyEntity) {
        const api = ApiUrl.ToUrl('/admin/Agency/AddOrUpdate');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
    async addOrUpdateAgencyNote(obj: AgencyNoteEntity) {
        const api = ApiUrl.ToUrl('/admin/AgencyNote/AddOrUpdate');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }     
    async addOrUpdateAgencyDocument(obj: AgencyDocumentEntity) {
        const api = ApiUrl.ToUrl('/admin/AgencyDocument/AddOrUpdate');
        return await this.ToResultApi(api, MethodType.Post, obj);
    }     
    async brokerNotes(id: number) {
        const api = ApiUrl.ToUrl('/admin/AgencyNote/Items/' + id);
        return await this.ToResultApi(api, MethodType.Get);
    } 
    async viewReport(type: string, id: number) {
        let token = this.getToken();
        const api = ApiUrl.ToUrl('/admin/Report/ViewReportPdf/' + type + '/' + id);
        return this.http.request(new HttpRequest('GET', api, null,
            {
                responseType: 'blob',
                reportProgress: true,
                headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
            }));
    }
}