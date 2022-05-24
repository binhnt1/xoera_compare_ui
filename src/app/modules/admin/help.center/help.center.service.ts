import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUrl } from '../../../_core/helpers/api.url.helper';
import { QuestionDto } from '../../../_core/domains/entities/question.entity';

export class ActiveMenu {
    title: string;
    active: boolean;
}

@Injectable()
export class HelpCenterService {
    constructor(private http: HttpClient) {
    }
    
    keyword: string;
    questions: QuestionDto[];
    breadcrumbs: string[] = [];
    menus: ActiveMenu[] = [{ title: 'Generic FAQs', active: true }];

    async getQuestions(): Promise<QuestionDto[]> {
        const api = ApiUrl.ToUrl('/admin/helpQuestion/items');
        return await this.http
            .get(api)
            .toPromise()
            .then(c => { return <QuestionDto[]>c; });
    }
}