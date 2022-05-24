import * as _ from 'lodash';
import { SiteService } from '../site.service';
import { AppInjector } from '../../../../app.module';
import { Component, OnInit, Input } from '@angular/core';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { U01RequestData } from '../../../../_core/domains/entities/hubfile.entity';

@Component({
    templateUrl: './popup.u01.request.component.html',
    styleUrls: ['./popup.u01.request.component.scss'],
})
export class PopupU01RequestComponent implements OnInit {
    result: any;
    siteId: number;
    error: boolean;
    meterReadId: number;
    errorMessage: string;
    @Input() params: any;
    service: SiteService;
    item: U01RequestData = new U01RequestData();

    constructor() {
        this.service = AppInjector.get(SiteService);
    }

    async ngOnInit() {
        this.siteId = this.params && this.params['siteId'];
    }

    choiceChange(meterReadId: number) {
        this.meterReadId = meterReadId;
        this.error = false;
    }

    public async confirm(): Promise<boolean> {
        this.errorMessage = null;
        let valid = await validation(this.item);
        if (!this.item || !this.meterReadId) {
            this.error = true;
            return false;
        }
        if (valid) {
            this.item.MeterReadId = this.meterReadId;
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
        return false;
    }
}