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
    id: number;
    popup: boolean;
    @Input() params: any;
    loading: boolean = true;
    service: AdminApiService;
    JobBiddingType = JobBiddingType;
    item: JobBiddingDto = new JobBiddingDto();

    constructor() {
        super();
        this.service = AppInjector.get(AdminApiService);
        this.state = this.getUrlState();
    }

    async ngOnInit() {
        this.id = this.params && this.params['id'];
        this.popup = this.params && this.params['popup'];
        if (!this.popup) {
            if (this.state) {
                this.id = this.state.id;
                this.addBreadcrumb(this.id ? 'Edit' : 'Add');
            }
        }
        await this.loadItem();
        this.loading = false;
    }

    private async loadItem() {
        this.item.Type = JobBiddingType.Accepted;
    }

    public async confirm(complete: () => void): Promise<boolean> {
        if (this.item) {
            let columns = this.item.Type == JobBiddingType.Accepted
                ? ['PriceBidding']
                : ['Reason'];
            if (await validation(this.item, columns)) {
                this.processing = true;
                if (this.item.Type == JobBiddingType.Accepted) {
                    // accept
                    return await this.service.callApi('job', 'accept', {
                        Id: this.id,
                        PriceBidding: this.item.PriceBidding
                    }, MethodType.Post).then((result: ResultApi) => {
                        this.processing = false;
                        if (ResultApi.IsSuccess(result)) {
                            ToastrHelper.Success('Accept job success');
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
                } else {
                    // reject
                    return await this.service.callApi('job', 'reject', {
                        Id: this.id,
                        Reason: this.item.Reason
                    }, MethodType.Post).then((result: ResultApi) => {
                        this.processing = false;
                        if (ResultApi.IsSuccess(result)) {
                            ToastrHelper.Success('Reject job success');
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
        }
        return false;
    }
}