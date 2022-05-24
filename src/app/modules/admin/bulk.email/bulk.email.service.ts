import { Injectable } from '@angular/core';
import { ApiUrl } from '../../../_core/helpers/api.url.helper';
import { MethodType } from '../../../_core/domains/enums/method.type';
import { AdminApiService } from '../../../_core/services/admin.api.service';
import { BulkMailDto } from '../../../_core/domains/objects/bulk.email.dto';

@Injectable()
export class BulkEmailService extends AdminApiService {   
    async loadContacts(type: string) {
        const api = ApiUrl.ToUrl('/admin/BulkEmail/contacts/' + type);
        return await this.ToResultApi(api, MethodType.Get);
    }

    public async sendEmail(entity: BulkMailDto) {
        let contacts = [],
            contact = entity.Contacts[0];
        if (contact.AgentId) contacts = entity.Contacts.map(c => { return { Name: c.Name, Email: c.Email, AgentId: c.AgentId }; });
        else if (contact.EmployeeId) contacts = entity.Contacts.map(c => { return { Name: c.Name, Email: c.Email, EmployeeId: c.EmployeeId }; });
        else if (contact.BrokerLeadId) contacts = entity.Contacts.map(c => { return { Name: c.Name, Email: c.Email, BrokerLeadId: c.BrokerLeadId }; });
        else contacts = entity.Contacts;
        
        let params: any = {
            Contacts: contacts,
            Subject: entity.Subject,
            Content: entity.Content,
            Attachments: entity.FileAttachments,
            SmtpAccountId: entity.SmtpAccountId,
        };
        const api = ApiUrl.ToUrl('/admin/BulkEmail');
        return await this.ToResultApi(api, MethodType.Post, params);
    }
}