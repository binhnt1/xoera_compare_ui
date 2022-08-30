import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { JobBiddingDto } from '../../../../_core/domains/objects/job.dto';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { JobBiddingType } from '../../../../_core/domains/enums/job.status.type';
import { EntityHelper } from 'src/app/_core/helpers/entity.helper';
import { MethodType } from 'src/app/_core/domains/enums/method.type';

@Component({
    templateUrl: './bidding.job.component.html',
    styleUrls: [
        './bidding.job.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class BiddingJobComponent extends EditComponent implements OnInit {
    priceMin: number;
    priceMax: number;
    item: JobBiddingDto;
    @Input() params: any;
    loading: boolean = true;
    service: AdminApiService;
    JobBiddingType = JobBiddingType;

    constructor() {
        super();
        this.service = AppInjector.get(AdminApiService);
        this.state = this.getUrlState();
    }

    async ngOnInit() {
        let id = this.params && this.params['id'],
            price = (this.params && this.params['price']) || 0,
            marginPrice = (this.params && this.params['margin']) || 0;

        this.priceMin = price - marginPrice;
        this.priceMax = price + marginPrice;
        this.item = EntityHelper.createEntity(JobBiddingDto, { Id: id });
        this.loading = false;
    }

    public async confirm(complete: () => void): Promise<boolean> {
        if (this.item) {
            if (await validation(this.item, ['PriceBidding'])) {
                // biding
                this.processing = true;
                return await this.service.callApi('job', 'bidding', {
                    Id: this.item.Id,
                    PriceBidding: this.item.PriceBidding
                }, MethodType.Post).then((result: ResultApi) => {
                    this.processing = false;
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Bidding job success');
                        if (complete) complete();
                        return true;
                    } else {
                        ToastrHelper.ErrorResult(result);
                        return false;
                    }
                }, () => {
                    this.processing = false;
                    return false;
                });
            }
        }
        return false;
    }
}