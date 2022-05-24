import * as _ from 'lodash';
import { SiteService } from '../site.service';
import { AppInjector } from '../../../../app.module';
import { Component, OnInit, Input } from '@angular/core';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { C41RequestData } from '../../../../_core/domains/entities/hubfile.entity';
import { MeterReadEntity } from '../../../../_core/domains/entities/meter.read.entity';

@Component({
    templateUrl: './popup.c41.request.component.html',
    styleUrls: ['./popup.c41.request.component.scss'],
})
export class PopupC41RequestComponent implements OnInit {
    result: any;
    siteId: number;
    errorMessage: string;
    @Input() params: any;
    service: SiteService;
    item: C41RequestData = new C41RequestData();

    constructor() {
        this.service = AppInjector.get(SiteService);
    }

    async ngOnInit() {
        this.siteId = this.params && this.params['siteId'];
    }

    meterReadChange() {
        if (this.item.MeterRead) {
            this.service.getMeterReadForC41(this.item.MeterRead).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let meterRead: MeterReadEntity = result.Object;
                    this.item.MeterReading = meterRead.MeterReading;
                    this.item.MeterReadingDate = meterRead.ActualReadDate;
                    this.item.MeterSerialNumber = meterRead.MeterSerialNumber;
                }
            });
        } else {
            this.item.MeterReading = null;
            this.item.MeterReadingDate = null;
            this.item.MeterSerialNumber = null;
        }
    }

    public async confirm(): Promise<boolean> {
        let valid = false;
        this.errorMessage = null;
        let reason = this.item.RequestReason
            ? parseInt(this.item.RequestReason.toString())
            : 0;
        switch (reason) {
            case 1:
            case 3:
                valid = await validation(this.item, ['RequestReason', 'RequestedEstimated']);
                break;
            case 2:
                valid = await validation(this.item, ['RequestReason', 'RequestedEstimated', 'SupportingInformation']);
                break;
            case 4:
                valid = await validation(this.item, ['RequestReason', 'RequestedEstimated', 'MeterSerialNumber', 'MeterReadingDate', 'MeterReading']);
                break;
            case 5:
                valid = await validation(this.item, ['RequestReason', 'RequestedWc']);
                break;
            default:
                valid = await validation(this.item, ['RequestReason']);
                break;
        }
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