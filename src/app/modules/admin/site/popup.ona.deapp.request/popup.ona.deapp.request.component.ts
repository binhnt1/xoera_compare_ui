import * as _ from 'lodash';
import { SiteService } from '../site.service';
import { AppInjector } from '../../../../app.module';
import { Component, OnInit, Input } from '@angular/core';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { ONADeAppType, ONAType } from '../../../../_core/domains/enums/ona.type';
import { ONADeAppRequestData } from '../../../../_core/domains/entities/hubfile.entity';

@Component({
    templateUrl: './popup.ona.deapp.request.component.html',
    styleUrls: ['./popup.ona.deapp.request.component.scss'],
})
export class PopupONADeAppRequestComponent implements OnInit {
    result: any;
    errorMessage: string;
    @Input() params: any;
    service: SiteService;
    ONADeAppType = ONADeAppType;
    item: ONADeAppRequestData = new ONADeAppRequestData();

    constructor() {
        this.service = AppInjector.get(SiteService);
    }

    async ngOnInit() {
        this.item.Type = this.params && this.params['type'];
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