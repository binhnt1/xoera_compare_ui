import * as _ from 'lodash';
import { SiteService } from '../site.service';
import { AppInjector } from '../../../../app.module';
import { Component, OnInit, Input } from '@angular/core';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { MeterEntity } from '../../../../_core/domains/entities/meter.entity';
import { ONJOBRequestData } from '../../../../_core/domains/entities/hubfile.entity';
import { MeterReadEntity } from '../../../../_core/domains/entities/meter.read.entity';
import { MeterWorkRequestType } from '../../../../_core/domains/enums/meter.work.request.type';

@Component({
    templateUrl: './popup.onjob.request.component.html',
    styleUrls: ['./popup.onjob.request.component.scss'],
})
export class PopupONJOBRequestComponent implements OnInit {
    result: any;
    siteId: number;
    nodeId: number;
    disabled: boolean;
    errorMessage: string;
    @Input() params: any;
    service: SiteService;
    MeterWorkRequestType = MeterWorkRequestType;
    item: ONJOBRequestData = new ONJOBRequestData();
    currentItem: ONJOBRequestData = new ONJOBRequestData();

    constructor() {
        this.service = AppInjector.get(SiteService);
    }

    async ngOnInit() {
        this.item.MeterWorkRequestType = this.params && this.params['type'];
        this.nodeId = this.params && this.params['nodeId'];
        this.siteId = this.params && this.params['siteId'];
        this.typeChange();
    }

    public async typeChange() {
        switch (this.item.MeterWorkRequestType) {
            case MeterWorkRequestType.Remove: {
                await this.loadMeterRE();
                this.item = EntityHelper.createEntity(ONJOBRequestData, this.currentItem);
                this.item.MeterWorkRequestType = MeterWorkRequestType.Remove;
            }
                break;
            case MeterWorkRequestType.Install: {
                this.loadMeterLI();
            }
                break;
            case MeterWorkRequestType.Exchange: {
                this.loadMeterLI();
                await this.loadMeterRE();
                this.item.RemoveRequestData = this.currentItem;
            }
                break;
            case MeterWorkRequestType.Reposition: {
                this.loadMeterLI();
                await this.loadMeterRE();
                this.item.RemoveRequestData = this.currentItem;
            }
                break;
        }
    }

    public async confirm(): Promise<boolean> {
        this.errorMessage = null;
        let valid = this.item.MeterWorkRequestType == MeterWorkRequestType.Remove
            ? await validation(this.item, ['Mam', 'AssetClassCode', 'RegisterTypeCode', 'ReadingIndex', 'MultiplicationFactor'])
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

    private loadMeterLI() {
        this.service.loadMeterLI(this.siteId).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                let meter = result.Object as MeterEntity,
                    meterReads = result.Object && result.Object.MeterRead as MeterReadEntity[],
                    meterRead = meterReads && meterReads.length > 0 && meterReads[meterReads.length - 1];
                this.item.RegisterTypeCode = 'METER';
                if (meter) {
                    this.item.MeterId = meter.Id;
                    this.item.RoleCode = meter.GasActOwner;
                    this.item.MeterTypeCode = meter.MeterType;
                    this.item.ModelCode = meter.MeterModelName;
                    this.item.AssetStatusCode = meter.MeterStatus;
                    this.item.SerialNumber = meter.MeterSerialNumber;
                    this.item.ReadingDate = meterRead?.ActualReadDate;
                    this.item.NoOfDigits = meter.NumberOfDialsOrDigits;
                    this.item.MeterMechanismCode = meter.MeterMechanism;
                    this.item.PaymentMethodCode = meter.PaymentMethodCode;
                    this.item.MeasuringCapacity = meter.MeasuringCapacity;
                    this.item.RoundTheClock = meterRead?.MeterRoundTheClock;
                    this.item.UnitsOfMeasure = meter.ImperialMeterIndicator;
                    this.item.ManufacturerCode = meter.MeterManufacturerCode;
                    this.item.YearOfManufacture = meter.MeterManufacturedYear;
                    this.item.MultiplicationFactor = meter.MeterReadingFactor;
                    this.item.AssetLocationNotes = meter.MeterLocationDescription;
                    this.item.ReadingIndex = meterRead && meterRead.MeterReading ? parseInt(meterRead.MeterReading) : null;
                    this.item.LocationCode = meter.MeterLocationCode ? parseInt(meter.MeterLocationCode) : null;
                }
            }
        });
    }

    private async loadMeterRE() {
        this.errorMessage = null;
        await this.service.loadMeterRE(this.siteId).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                let meter = result.Object as MeterEntity,
                    meterReads = result.Object && result.Object.MeterRead as MeterReadEntity[],
                    meterRead = meterReads && meterReads.length > 0 && meterReads[meterReads.length - 1];
                this.item.RegisterTypeCode = 'METER';
                if (meter) {
                    this.disabled = true;
                    this.currentItem.MeterId = meter.Id;
                    this.currentItem.RoleCode = meter.GasActOwner;
                    this.currentItem.MeterTypeCode = meter.MeterType;
                    this.currentItem.ModelCode = meter.MeterModelName;
                    this.currentItem.AssetStatusCode = meter.MeterStatus;
                    this.currentItem.SerialNumber = meter.MeterSerialNumber;
                    this.currentItem.ReadingDate = meterRead?.ActualReadDate;
                    this.currentItem.NoOfDigits = meter.NumberOfDialsOrDigits;
                    this.currentItem.MeterMechanismCode = meter.MeterMechanism;
                    this.currentItem.PaymentMethodCode = meter.PaymentMethodCode;
                    this.currentItem.MeasuringCapacity = meter.MeasuringCapacity;
                    this.currentItem.RoundTheClock = meterRead?.MeterRoundTheClock;
                    this.currentItem.UnitsOfMeasure = meter.ImperialMeterIndicator;
                    this.currentItem.ManufacturerCode = meter.MeterManufacturerCode;
                    this.currentItem.YearOfManufacture = meter.MeterManufacturedYear;
                    this.currentItem.MultiplicationFactor = meter.MeterReadingFactor;
                    this.currentItem.AssetLocationNotes = meter.MeterLocationDescription;
                    this.currentItem.ReadingIndex = meterRead && meterRead.MeterReading ? parseInt(meterRead.MeterReading) : null;
                    this.currentItem.LocationCode = meter.MeterLocationCode ? parseInt(meter.MeterLocationCode) : null;
                } else {
                    this.errorMessage = 'No meter to remove';
                    this.disabled = this.item.MeterWorkRequestType == MeterWorkRequestType.Install ? false : true;
                }
            }
        });
    }
}