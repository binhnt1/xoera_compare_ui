import * as _ from 'lodash';
import { SiteService } from '../site.service';
import { AppInjector } from '../../../../app.module';
import { Component, OnInit, Input } from '@angular/core';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { MeterEntity } from '../../../../_core/domains/entities/meter.entity';
import { PO3RequestData } from '../../../../_core/domains/entities/hubfile.entity';

@Component({
    templateUrl: './popup.po3.request.component.html',
    styleUrls: ['./popup.po3.request.component.scss'],
})
export class PopupPO3RequestComponent implements OnInit {
    result: any;
    siteId: number;
    nodeId: number;
    errorMessage: string;
    @Input() params: any;
    service: SiteService;
    item: PO3RequestData = new PO3RequestData();

    constructor() {
        this.service = AppInjector.get(SiteService);
    }

    async ngOnInit() {
        this.nodeId = this.params && this.params['nodeId'];
        this.siteId = this.params && this.params['siteId'];
        this.loadMeter();
    }

    public async confirm(): Promise<boolean> {
        this.errorMessage = null;
        if (await validation(this.item)) {
            if (this.item && this.nodeId && this.siteId) {
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
        }
        return false;
    }

    private loadMeter() {
        this.service.loadMeterLI(this.siteId).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                let meter = result.Object as MeterEntity;
                if (meter) {
                    //this.item.Mam = meter.ma
                    //this.item.EffectiveFromDate = meter.date
                    this.item.MeterMechanism = meter.MeterMechanism;
                    this.item.MeterReadingUnit = meter.MeterReadingUnits;
                    this.item.MeterSerialNumber = meter.MeterSerialNumber;
                    this.item.NumberOfDialsOrDigits = meter.NumberOfDialsOrDigits;
                    this.item.MeterManufacturerName = meter.MeterManufacturerCode;
                    this.item.MeterManufacturerYear = meter.MeterManufacturedYear;
                    this.item.ConverterSerialNumber = meter.ConvertorSerialNumber;
                    this.item.ImperialMeterIndicator = meter.ImperialMeterIndicator;
                    this.item.MeterPointCorrectionFactor = meter.MeterReadingFactor;
                    this.item.ConverterManufacturerName = meter.ConvertorManufacturer;
                    this.item.MeterLocationDescription = meter.MeterLocationDescription;
                    this.item.ConverterManufactureYear = meter.ConvertorManufacturedYear;
                    this.item.MeterLocationCode = meter.MeterLocationCode && parseInt(meter.MeterLocationCode);
                    this.item.ConverterCorrectionFactor = meter.ConvertorCorrectionFactor && parseInt(meter.ConvertorCorrectionFactor)
                }
            }
        });
    }
}