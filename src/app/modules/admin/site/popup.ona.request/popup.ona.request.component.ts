import * as _ from 'lodash';
import { SiteService } from '../site.service';
import { AppInjector } from '../../../../app.module';
import { Component, OnInit, Input } from '@angular/core';
import { ONAType } from '../../../../_core/domains/enums/ona.type';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { MeterEntity } from '../../../../_core/domains/entities/meter.entity';
import { ONARequestData } from '../../../../_core/domains/entities/hubfile.entity';

@Component({
    templateUrl: './popup.ona.request.component.html',
    styleUrls: ['./popup.ona.request.component.scss'],
})
export class PopupONARequestComponent implements OnInit {
    result: any;
    siteId: number;
    nodeId: number;
    ONAType = ONAType;
    disabled: boolean;
    errorMessage: string;
    @Input() params: any;
    service: SiteService;
    item: ONARequestData = new ONARequestData();

    constructor() {
        this.service = AppInjector.get(SiteService);
    }

    async ngOnInit() {
        this.nodeId = this.params && this.params['nodeId'];
        this.siteId = this.params && this.params['siteId'];
        if (this.nodeId == 41) {
            this.item.Type = ONAType.FIX;
        } else this.item.Type = this.params && this.params['type'];
    }

    public typeChange() {
        if (this.item.Type == ONAType.FIX) {
            this.item = new ONARequestData();
            this.item.Type = ONAType.FIX;
        } else this.loadMeter();
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
        this.errorMessage = null;
        this.service.loadMeterLI(this.siteId).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                let meter = result.Object as MeterEntity;
                this.item.RegisterTypeCode = 'METER';
                if (meter) {
                    this.disabled = false;
                    this.item.MeterId = meter.Id;
                    this.item.RoleCode = meter.GasActOwner;
                    this.item.MeterTypeCode = meter.MeterType;
                    this.item.ModelCode = meter.MeterModelName;
                    this.item.AssetStatusCode = meter.MeterStatus;
                    this.item.SerialNumber = meter.MeterSerialNumber;
                    this.item.LocationCode = meter.MeterLocationCode;
                    this.item.NoOfDigits = meter.NumberOfDialsOrDigits;
                    this.item.MeterMechanismCode = meter.MeterMechanism;
                    this.item.PaymentMethodCode = meter.PaymentMethodCode;
                    this.item.MeasuringCapacity = meter.MeasuringCapacity;
                    this.item.UnitsofMeasure = meter.ImperialMeterIndicator;
                    this.item.ManufacturerCode = meter.MeterManufacturerCode;
                    this.item.YearOfManufacture = meter.MeterManufacturedYear;
                    this.item.MultiplicationFactor = meter.MeterReadingFactor;
                    this.item.AssetLocationNotes = meter.MeterLocationDescription;
                } else {
                    this.errorMessage = 'No meter to remove';
                    this.disabled = this.item.Type == ONAType.FIX ? false : true;
                }
            }
        });
    }
}