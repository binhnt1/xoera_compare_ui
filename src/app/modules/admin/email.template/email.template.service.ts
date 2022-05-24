import { Injectable } from '@angular/core';
import { ApiUrl } from '../../../_core/helpers/api.url.helper';
import { MethodType } from '../../../_core/domains/enums/method.type';
import { AdminApiService } from '../../../_core/services/admin.api.service';
import { EmailTemplateEntity } from '../../../_core/domains/entities/email.template.entity';

@Injectable()
export class EmailTemplateService extends AdminApiService {
    public async saveEmail(entity: EmailTemplateEntity) {
        let method = entity.Id ? MethodType.Put : MethodType.Post;
        const api = entity.Id
            ? ApiUrl.ToUrl('/admin/EmailTemplate/Save')
            : ApiUrl.ToUrl('/admin/EmailTemplate');

        if (entity) {
            delete entity.Active;
            delete entity.Deleted;
            delete entity.CreatedBy;
            delete entity.CreatedAt;
            delete entity.LastUpdatedBy;
            delete entity.LastUpdatedAt;
        }
        return await this.ToResultApi(api, method, entity);
    }
}