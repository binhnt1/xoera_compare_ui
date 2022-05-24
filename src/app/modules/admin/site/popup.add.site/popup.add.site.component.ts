import * as _ from 'lodash';
import { SiteService } from '../site.service';
import { Component, OnInit } from '@angular/core';
import { AppInjector } from '../../../../app.module';
import { validation } from '../../../../_core/decorators/validator';
import { SiteDto } from '../../../../_core/domains/objects/site.dto';
import { SiteType } from '../../../../_core/domains/enums/site.type';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { MprnEntity } from '../../../../_core/domains/entities/mprn.entity';

@Component({
    templateUrl: './popup.add.site.component.html',
    styleUrls: ['./popup.add.site.component.scss'],
})
export class PopupAddSiteComponent implements OnInit {
    SiteType = SiteType;
    service: SiteService;
    min: Date = new Date();
    max: Date = new Date();
    item: SiteDto = new SiteDto();

    constructor() {
        this.service = AppInjector.get(SiteService);

        // set min/max
        this.min.setDate(this.min.getDate() + 15);
        this.max.setFullYear(this.max.getFullYear() + 1);
    }

    async ngOnInit() {
        this.item.Type = SiteType.Commercial;
    }

    typeChange() {
        this.item.DateOfBirth = null;
        this.item.ContactTitle = null;
        this.item.BusinessName = null;
        this.item.CompanyNumber = null;
        this.item.ContactSurname = null;
        this.item.ContactFirstName = null;
    }

    selectedChange(obj: MprnEntity) {
        this.item.Mprn = obj.Mprn1,
        this.item.Street = obj.Column11;
        this.item.PostTown = obj.Column14;
        this.item.BuildingName = obj.Column10;
        this.item.BuildingNumber = obj.Column9;
        this.item.PostCode = obj.Outcode + ' ' + obj.Incode;
    }

    public async confirm(): Promise<boolean> {
        if (await validation(this.item)) {
            if (this.item) {
                return await this.service.createSite(this.item).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success("Create site success");
                        return true;                        
                    } else {
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