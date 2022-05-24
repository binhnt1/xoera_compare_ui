import * as _ from 'lodash';
import { SiteService } from '../site.service';
import { AppInjector } from '../../../../app.module';
import { Component, OnInit, Input } from '@angular/core';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { T05RequestData } from '../../../../_core/domains/entities/hubfile.entity';

@Component({
    templateUrl: './popup.t05.request.component.html',
    styleUrls: ['./popup.t05.request.component.scss'],
})
export class PopupT05RequestComponent implements OnInit {
    result: any;
    siteId: number;
    errorMessage: string;
    @Input() params: any;
    service: SiteService;
    item: T05RequestData = new T05RequestData();

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