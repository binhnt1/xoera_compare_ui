import * as _ from 'lodash';
import { SiteService } from '../site.service';
import { AppInjector } from '../../../../app.module';
import { Component, OnInit, Input } from '@angular/core';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { C42RequestData } from '../../../../_core/domains/entities/hubfile.entity';

@Component({
    templateUrl: './popup.c42.request.component.html',
    styleUrls: ['./popup.c42.request.component.scss'],
})
export class PopupC42RequestComponent implements OnInit {
    result: any;
    siteId: number;
    errorMessage: string;
    @Input() params: any;
    service: SiteService;
    item: C42RequestData = new C42RequestData();

    constructor() {
        this.service = AppInjector.get(SiteService);
    }

    async ngOnInit() {
        this.siteId = this.params && this.params['siteId'];
    }

    public async confirm(): Promise<boolean> {
        this.errorMessage = null;
        let valid = await validation(this.item);
        if (valid) {
            if (this.item) {
                let nodeId = this.params && this.params['nodeId'],
                    siteId = this.params && this.params['siteId'],
                    save = this.params && this.params['save'];
                return await this.service.createNode(nodeId, siteId, this.item, save).then((result: ResultApi) => {
                    this.result = result;
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success("Create flow success");
                        return true;
                    } else {
                        this.errorMessage = result && result.Description;
                        return false;
                    }
                }, (e) => {
                    ToastrHelper.Exception(e);
                    return false;
                });
            }
        }
        return false;
    }
}