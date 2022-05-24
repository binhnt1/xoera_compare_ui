import * as _ from 'lodash';
import { SiteService } from '../site.service';
import { AppInjector } from '../../../../app.module';
import { Component, OnInit, Input } from '@angular/core';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { ONUPDType } from '../../../../_core/domains/enums/onupd.type';
import { MeterEntity } from '../../../../_core/domains/entities/meter.entity';
import { ONUPDRequestData } from '../../../../_core/domains/entities/hubfile.entity';
import { MeterReadEntity } from '../../../../_core/domains/entities/meter.read.entity';
import { MeterPointEntity } from '../../../../_core/domains/entities/meter.point.entity';

@Component({
    templateUrl: './popup.onupd.request.component.html',
    styleUrls: ['./popup.onupd.request.component.scss'],
})
export class PopupONUPDRequestComponent implements OnInit {
    result: any;
    siteId: number;
    nodeId: number;
    errorMessage: string;
    @Input() params: any;
    service: SiteService;
    ONUPDType = ONUPDType;
    item: ONUPDRequestData = new ONUPDRequestData();

    constructor() {
        this.service = AppInjector.get(SiteService);
    }

    async ngOnInit() {
        this.nodeId = this.params && this.params['nodeId'];
        this.siteId = this.params && this.params['siteId'];
        this.item.Type = this.params && this.params['type'];
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
                let meter = result.Object as MeterEntity,
                    meterReads = result.Object && result.Object.MeterRead as MeterReadEntity[],
                    meterPoint = result.Object && result.Object.MeterPoint as MeterPointEntity,
                    meterRead = meterReads && meterReads.length > 0 && meterReads[meterReads.length - 1];

                    console.log(meterRead);
                this.item.RegisterTypeCode = 'METER';
                if (meter) {
                    //this.item.Mam = meter.ma
                    //this.item.EffectiveFromDate = meter.date
                    this.item.MeterId = meter.Id;
                    this.item.Mprn = meterPoint?.Mpr;
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
                    this.item.RoundTheClock = meterRead?.MeterRoundTheClock;
                    this.item.ManufacturerCode = meter.MeterManufacturerCode;
                    this.item.YearOfManufacture = meter.MeterManufacturedYear;
                    this.item.MultiplicationFactor = meter.MeterReadingFactor;
                    this.item.AssetLocationNotes = meter.MeterLocationDescription;
                    this.item.ReadingIndex = meterRead && meterRead.MeterReading ? parseInt(meterRead.MeterReading) : null;
                    this.item.ReadingDate = meterRead && meterRead.ActualReadDate ? new Date(meterRead.ActualReadDate) : null;
                }
            }
        });
    }
}