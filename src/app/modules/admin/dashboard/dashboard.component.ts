import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { AdminApiService } from '../../../_core/services/admin.api.service';
import { AdminAuthService } from '../../../_core/services/admin.auth.service';
import { AdminEventService } from '../../../_core/services/admin.event.service';
import { AdminDialogService } from '../../../_core/services/admin.dialog.service';
import { CompanyDto } from 'src/app/_core/domains/objects/company.dto';
import { ResultApi } from 'src/app/_core/domains/data/result.api';
import { EntityHelper } from 'src/app/_core/helpers/entity.helper';
import { MethodType } from 'src/app/_core/domains/enums/method.type';
import { ToastrHelper } from 'src/app/_core/helpers/toastr.helper';
import { LicenceEntity } from 'src/app/_core/domains/entities/licence.entity';
import { SummaryExchangeDto } from 'src/app/_core/domains/objects/summary.exchange.dto';
import { SummaryPriceDto } from 'src/app/_core/domains/objects/summary.price.dto';
import { UtilityExHelper } from 'src/app/_core/helpers/utility.helper';

@Component({
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    item: CompanyDto;
    tabDispatch: string;
    licence: LicenceEntity;
    loading: boolean = true;
    priceDto: SummaryPriceDto;
    licenceClone: LicenceEntity;
    activePrice: boolean = true;
    activeProfile: boolean = true;
    activeLicence: boolean = true;
    activeExchange: boolean = true;
    exchangeDto: SummaryExchangeDto;
    readonlyIsPublic: boolean = false;

    constructor(
        public auth: AdminAuthService,
        public event: AdminEventService,
        public service: AdminApiService,
        public dialog: AdminDialogService) {
        this.exchangeDto = EntityHelper.createEntity(SummaryExchangeDto, {
            Partners: 3,
            AcceptedJobs: 4,
            AvaiableJobs: 5,
            CompletedJobs: 6,
            PublishedJobs: 5,
            PaymentPending: 100,
        });
    }

    ngOnInit(): void {
        this.service.callApi('company', 'item').then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                this.item = EntityHelper.createEntity(CompanyDto, result.Object);
                this.readonlyIsPublic = this.item.IsPublic;
                if (this.item.Licences && this.item.Licences.length > 0) {
                    this.licence = EntityHelper.createEntity(LicenceEntity, this.item.Licences[0]);
                    this.licenceClone = _.cloneDeep(this.licence);
                    this.licence.ClientKey = "********************";
                    this.licence.DesktopClientKey = "********************";
                }
                if (this.item.Prices && this.item.Prices.length > 0) {
                    this.priceDto = EntityHelper.createEntity(SummaryPriceDto, this.item.Prices[0]);
                }
            }
            this.loading = false;
        });
    }

    public() {
        if (this.item.IsPublic) {
            this.dialog.ConfirmAsync('Do you want public profile?', async () => {
                this.service.callApi('company', 'Public', null, MethodType.Post).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        this.readonlyIsPublic = true;
                        ToastrHelper.Success('Public profile success');
                    } else ToastrHelper.ErrorResult(result);
                })
            }, () => this.item.IsPublic = false);
        }
    }

    viewClientKey() {
        this.licence.ClientKey = this.licenceClone.ClientKey;
    }

    copyClientKey() {
        UtilityExHelper.copyString(this.licenceClone.ClientKey);
        ToastrHelper.Success('Copy mobile client key success');
    }

    viewDesktopClientKey() {
        this.licence.DesktopClientKey = this.licenceClone.DesktopClientKey;
    }

    copyDesktopClientKey() {
        UtilityExHelper.copyString(this.licenceClone.DesktopClientKey);
        ToastrHelper.Success('Copy desktop client key success');
    }

    selectTabDispatch(tab: string) {
        this.tabDispatch = tab;
    }

    toogleIsPublic(item: boolean) {
        this.item.IsPublic = item;
        this.public();
    }
}
