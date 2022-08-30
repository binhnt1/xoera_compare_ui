import * as _ from 'lodash';
import { RouterModule } from '@angular/router';
import { Component, NgModule, OnDestroy, OnInit } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../_core/domains/data/grid.data';
import { EditJobComponent } from './edit.job/edit.job.component';
import { DataType } from '../../../_core/domains/enums/data.type';
import { ActionData } from '../../../_core/domains/data/action.data';
import { ActionType } from '../../../_core/domains/enums/action.type';
import { JobEntity } from '../../../_core/domains/entities/job.entity';
import { AdminAuthGuard } from '../../../_core/guards/admin.auth.guard';
import { BiddingJobComponent } from './bidding.job/bidding.job.component';
import { JobStatusType } from '../../../_core/domains/enums/job.status.type';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { NavigationStateData } from '../../../_core/domains/data/navigation.state';
import { Subscription } from 'rxjs/internal/Subscription';
import { NotifyType } from 'src/app/_core/domains/enums/notify.type';
import { ResultType } from 'src/app/_core/domains/enums/result.type';
import { ResultApi } from 'src/app/_core/domains/data/result.api';
import { NotifyEntity } from 'src/app/_core/domains/entities/notify.entity';
import { BaseEntity } from 'src/app/_core/domains/entities/base.entity';
import { ToastrHelper } from 'src/app/_core/helpers/toastr.helper';
import { EnumHelper } from 'src/app/_core/helpers/enum.helper';

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class JobComponent extends GridComponent implements OnInit, OnDestroy {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        Features: [
            ActionData.reload(() => {
                this.loadItems();
            }),
        ],
        Actions: [
            ActionData.view((item: any) => {
                this.view(item);
            }),
            {
                icon: 'la la-bolt',
                name: ActionType.Bidding,
                className: 'btn btn-success',
                systemName: ActionType.Bidding,
                hidden: ((item: any) => {
                    return !(item.AllowBidding && item.StatusType == JobStatusType.New);
                }),
                click: ((item: any) => {
                    this.bidding(item);
                })
            }
        ],
        UpdatedBy: false,
        Reference: JobEntity,
        Size: ModalSizeType.ExtraLarge,
    };
    subscribeRefreshGrids: Subscription;

    constructor() {
        super();
        this.properties = [
            {
                Property: 'Company', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '<p>' + item.Company + '</p>';
                    return text;
                }),
            },
            { Property: 'ZoneName', Type: DataType.String },
            { Property: 'LeadTime', Type: DataType.String },
            { Property: 'BookerRef', Type: DataType.String },
            { Property: 'BookingDateTime', Type: DataType.DateTime },
            { Property: 'PickupAddress', Type: DataType.String },
            { Property: 'DropoffAddress', Type: DataType.String },
            { Property: 'VehicleTypeName', Type: DataType.String },
            {
                Property: 'Price', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '<p>' + item.Price.toLocaleString("en-gb", { maximumFractionDigits: 2 }) + '</p>';
                    if (item.PriceBidding) text += '<p>Bidding: ' + item.PriceBidding.toLocaleString("en-gb", { maximumFractionDigits: 2 }) + '</p>';
                    if (item.Partner) text += '<p>Partner: ' + item.Partner + '</p>';
                    return text;
                }),
            },
            {
                Property: 'Passenger', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '<p>' + item.Passenger + '</p>';
                    if (item.PassengerPhone) text += '<p><i class=\'la la-phone\'></i> ' + item.PassengerPhone + '</p>';
                    if (item.PassengerEmail) text += '<p><i class=\'la la-inbox\'></i> ' + item.PassengerEmail + '</p>';
                    return text;
                }),
            },
            {
                Property: 'Status', Type: DataType.String,
                Format: ((item: any) => {
                    item.StatusType = item.Status;
                    let options = EnumHelper.exportOptionItems(JobStatusType),
                        option = options.find(c => c.value == item.Status);
                    if (option) {
                        if (option.value == JobStatusType.New) {
                            return this.authen.account.CompanyId == item.CompanyId
                                ? 'Published'
                                : option.label;
                        }
                        return option.label;
                    } return '';
                }),
            },
        ];
        this.render(this.obj);
    }

    ngOnInit(): void {
        // subscribe refreshItems
        if (!this.subscribeRefreshGrids) {
            this.subscribeRefreshGrids = this.event.RefreshGrids.subscribe(async (notify: NotifyEntity) => {
                switch (notify.Type) {
                    case NotifyType.JobAccepted: {
                        let jobId = notify.JsonObject;
                        await this.service.callApi('job', 'item/' + jobId).then((result: ResultApi) => {
                            if (result && result.Type == ResultType.Success) {
                                let items: BaseEntity[] = _.cloneDeep(this.originalItems) || [],
                                    index = items.findIndex(c => c.Id.toString() == jobId),
                                    item: BaseEntity = result.Object;
                                if (index >= 0) items[index] = item;
                                this.renderItems(items);
                            } else {
                                ToastrHelper.ErrorResult(result);
                            }
                        });
                    } break;
                    case NotifyType.JobPublished: {
                        let jobId = notify.JsonObject;
                        await this.service.callApi('job', 'item/' + jobId).then((result: ResultApi) => {
                            if (result && result.Type == ResultType.Success) {
                                let items: BaseEntity[] = _.cloneDeep(this.originalItems) || [],
                                    item: BaseEntity = result.Object;
                                items.splice(0, 0, item);
                                this.renderItems(items);
                            } else {
                                ToastrHelper.ErrorResult(result);
                            }
                        });
                    } break;
                }
            });
        }
    }

    ngOnDestroy(): void {
        if (this.subscribeRefreshGrids) {
            this.subscribeRefreshGrids.unsubscribe();
            this.subscribeRefreshGrids = null;
        }
    }

    view(item: JobEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            viewer: true,
            prevData: this.itemData,
            prevUrl: '/admin/job',
        };
        this.router.navigate(['/admin/job/view'], { state: { params: JSON.stringify(obj) } });
    }

    bidding(item: JobEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            confirmText: 'Confirm',
            size: ModalSizeType.Medium,
            object: BiddingJobComponent,
            objectExtra: { id: item.Id },
            title: 'Bidding Job: #' + item.BookerRef,
        }, async () => {
            this.loadItems();
        });
    }
}

@NgModule({
    declarations: [
        JobComponent,
        EditJobComponent,
        BiddingJobComponent
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: JobComponent, pathMatch: 'full', data: { state: 'job' }, canActivate: [AdminAuthGuard] },
            { path: 'add', component: EditJobComponent, pathMatch: 'full', data: { state: 'add_job' }, canActivate: [AdminAuthGuard] },
            { path: 'edit', component: EditJobComponent, pathMatch: 'full', data: { state: 'edit_job' }, canActivate: [AdminAuthGuard] },
            { path: 'view', component: EditJobComponent, pathMatch: 'full', data: { state: 'view_job' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class JobModule { }