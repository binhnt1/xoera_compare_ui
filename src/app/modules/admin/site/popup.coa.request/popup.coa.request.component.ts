import * as _ from 'lodash';
import { SiteService } from '../site.service';
import { AppInjector } from '../../../../app.module';
import { Component, OnInit, Input } from '@angular/core';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { COARequestData } from '../../../../_core/domains/entities/hubfile.entity';

@Component({
    templateUrl: './popup.coa.request.component.html',
    styleUrls: ['./popup.coa.request.component.scss'],
})
export class PopupCOARequestComponent implements OnInit {
    result: any;
    errorMessage: string;
    @Input() params: any;
    service: SiteService;
    item: COARequestData = new COARequestData();

    constructor() {
        this.service = AppInjector.get(SiteService);
    }

    async ngOnInit() {
    }

    public async confirm(): Promise<boolean> {
        this.errorMessage = null;
        if (await validation(this.item)) {
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