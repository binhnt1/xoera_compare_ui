import * as _ from 'lodash';
import { SiteService } from '../site.service';
import { AppInjector } from '../../../../app.module';
import { Component, OnInit, Input } from '@angular/core';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { MeterEntity } from '../../../../_core/domains/entities/meter.entity';
import { ORJOBRequestData } from '../../../../_core/domains/entities/hubfile.entity';
import { MeterWorkRequestType } from '../../../../_core/domains/enums/meter.work.request.type';

@Component({
    templateUrl: './popup.orjob.request.component.html',
    styleUrls: ['./popup.orjob.request.component.scss'],
})
export class PopupORJOBRequestComponent implements OnInit {
    result: any;
    siteId: number;
    nodeId: number;
    disabled: boolean;
    errorMessage: string;
    @Input() params: any;
    service: SiteService;
    Type = MeterWorkRequestType;
    item: ORJOBRequestData = new ORJOBRequestData();
    currentItem: ORJOBRequestData = new ORJOBRequestData();

    constructor() {
        this.service = AppInjector.get(SiteService);
    }

    async ngOnInit() {
        this.item.WorkRequestType = this.params && this.params['type'];
        this.nodeId = this.params && this.params['nodeId'];
        this.siteId = this.params && this.params['siteId'];
        this.typeChange();
    }

    public typeChange() {
        this.loadMeter();
    }

    public async confirm(): Promise<boolean> {
        this.errorMessage = null;
        let valid = this.item.WorkRequestType == MeterWorkRequestType.Remove
            ? await validation(this.item, ['AppointmentDateTime'])
            : await validation(this.item);
        if (valid && this.item && this.nodeId && this.siteId) {
            this.item.RemoveRequestData = this.currentItem;
            let save = this.params && this.params['save'];
            return await this.service.createNode(this.nodeId, this.siteId, this.item, save).then((result: ResultApi) => {
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

    private loadMeter() {
        this.errorMessage = null;
        this.service.loadMeterLI(this.siteId).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                let meter = result.Object as MeterEntity;
                if (meter) {
                    this.disabled = false;
                    this.currentItem.MeterId = meter.Id;
                    this.currentItem.MeterTypeCode = meter.MeterType;
                    this.currentItem.ModelCode = meter.MeterModelName;
                    this.currentItem.LocationCode = meter.MeterLocationCode;
                    this.currentItem.MeterMechanismCode = meter.MeterMechanism;
                    this.currentItem.PaymentMethodCode = meter.PaymentMethodCode;
                    this.currentItem.ManufacturerCode = meter.MeterManufacturerCode;
                    this.currentItem.AssetLocationNotes = meter.MeterLocationDescription;
                } else {
                    this.errorMessage = 'No meter to remove';
                    this.disabled = this.item.WorkRequestType == MeterWorkRequestType.Install ? false : true;
                }
            }
        });
    }
}