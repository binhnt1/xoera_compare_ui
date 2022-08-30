import * as _ from 'lodash';
import { RouterModule } from '@angular/router';
import { UtilityModule } from '../../utility.module';
import { Subscription } from 'rxjs/internal/Subscription';
import { EnumHelper } from '../../../_core/helpers/enum.helper';
import { GridData } from '../../../_core/domains/data/grid.data';
import { EditJobComponent } from './edit.job/edit.job.component';
import { DataType } from '../../../_core/domains/enums/data.type';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../_core/helpers/toastr.helper';
import { ActionData } from '../../../_core/domains/data/action.data';
import { NotifyType } from '../../../_core/domains/enums/notify.type';
import { ResultType } from '../../../_core/domains/enums/result.type';
import { ActionType } from '../../../_core/domains/enums/action.type';
import { MethodType } from '../../../_core/domains/enums/method.type';
import { JobEntity } from '../../../_core/domains/entities/job.entity';
import { Component, NgModule, OnDestroy, OnInit } from '@angular/core';
import { AdminAuthGuard } from '../../../_core/guards/admin.auth.guard';
import { BaseEntity } from '../../../_core/domains/entities/base.entity';
import { BiddingJobComponent } from './bidding.job/bidding.job.component';
import { NotifyEntity } from '../../../_core/domains/entities/notify.entity';
import { JobStatusType } from '../../../_core/domains/enums/job.status.type';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { NavigationStateData } from '../../../_core/domains/data/navigation.state';

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
                name: 'Accept/Bidding',
                className: 'btn btn-success',
                systemName: ActionType.Bidding,
                hidden: ((item: any) => {
                    return !(item.AllowBidding && item.StatusType == JobStatusType.New);
                }),
                click: ((item: any) => {
                    this.bidding(item);
                })
            },
            {
                icon: 'la la-times',
                name: ActionType.Reject,
                className: 'btn btn-primary',
                systemName: ActionType.Reject,
                hidden: ((item: any) => {
                    return !(item.AllowBidding && item.StatusType == JobStatusType.New);
                }),
                click: ((item: any) => {
                    this.reject(item);
                })
            }
        ],
        UpdatedBy: false,
        Reference: JobEntity,
        Size: ModalSizeType.ExtraLarge,
    };
    timerInterval: any;
    subscribeRefreshGrids: Subscription;

    constructor() {
        super();
        this.properties = [
            {
                Property: 'Company', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '<p>' + item.Company + '</p>';
                    if (item.Partner) text += '<p>Partner: ' + item.Partner + '</p>';
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
                    if (item.FixedPrice) {
                        let text = '<p>' + item.FixedPrice.toLocaleString("en-gb", { maximumFractionDigits: 2 }) + '</p>';
                        return text;
                    } else {
                        let text = '<p>' + item.Price.toLocaleString("en-gb", { maximumFractionDigits: 2 }) + '</p>';
                        if (item.MarginPrice) text += '<p>Margin: ' + item.MarginPrice.toLocaleString("en-gb", { maximumFractionDigits: 2 }) + '</p>';
                        if (item.PriceBidding) text += '<p>Bidding: ' + item.PriceBidding.toLocaleString("en-gb", { maximumFractionDigits: 2 }) + '</p>';
                        return text;
                    }
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
                Property: 'Status', Type: DataType.String, Align: 'center',
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
            {
                Property: 'ExpireTimeSeconds', Type: DataType.String, Align: 'center',
                Format: ((item: any) => {
                    let seconds = item.ExpireTimeSeconds;
                    if (seconds) {
                        return this.formatTime(item.Id, seconds);
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
                    case NotifyType.JobExpried: {
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
                    case NotifyType.JobBidding: {
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
        if (!this.timerInterval) {
            this.timerInterval = setInterval(() => {
                if (this.originalItems && this.originalItems.length > 0) {
                    let items = this.originalItems.filter(c => (<JobEntity>c).ExpireTimeSeconds);
                    if (items && items.length > 0) {
                        items.forEach((item: JobEntity) => {
                            let gridItem = <any>this.items.find(c => c.Id == item.Id);
                            if (gridItem) {
                                let seconds = item.ExpireTimeSeconds;
                                if (seconds && seconds > 0)
                                    seconds -= 1;
                                item.ExpireTimeSeconds = seconds;
                                gridItem.ExpireTimeSeconds = this.formatTime(item.Id, seconds);
                            }
                        });
                    }
                }
            }, 1000);
        }
    }

    ngOnDestroy(): void {
        if (this.subscribeRefreshGrids) {
            this.subscribeRefreshGrids.unsubscribe();
            this.subscribeRefreshGrids = null;
        }
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
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

    reject(item: JobEntity) {
        this.dialogService.ConfirmAsync('Do you want reject job: #' + item.BookerRef + '?', async () => {
            // reject
            return await this.service.callApi('job', 'reject', {
                Id: item.Id,
                Reason: this.authen.account.Email + ' reject job',
            }, MethodType.Post).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success('Reject job success');
                    this.loadItems();
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        });
    }

    bidding(item: JobEntity) {
        if (item.FixedPrice && item.FixedPrice > 0) {
            this.dialogService.ConfirmAsync('Do you want accept job: #' + item.BookerRef + '?', async () => {
                // reject
                return await this.service.callApi('job', 'accept', {
                    Id: item.Id,
                    Reason: this.authen.account.Email + ' accept job',
                }, MethodType.Post).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                       this.loadItems();
                    } else {
                        ToastrHelper.ErrorResult(result);
                    }
                });
            });
        } else {
            let originalItem = <any>this.originalItems.find(c => c.Id == item.Id);
            this.dialogService.WapperAsync({
                cancelText: 'Close',
                confirmText: 'Confirm',
                size: ModalSizeType.Medium,
                object: BiddingJobComponent,
                objectExtra: { 
                    id: originalItem.Id,
                    price: originalItem.Price,
                    margin: originalItem.MarginPrice
                },
                title: 'Bidding Job: #' + item.BookerRef,
            }, async () => {
                this.loadItems();
            });
        }
    }

    private formatTime(id: number, value: any) {
        let item = <any>this.items?.find(c => c.Id == id);
        if (item.StatusType == JobStatusType.Accepted) {
            return '';
        } else if (item.StatusType == JobStatusType.Expired) {
            return 'Expired';
        }
        if (value && value > 0) {
            var sec_num = parseInt(value, 10);
            var hours = Math.floor(sec_num / 3600)
            var minutes = Math.floor(sec_num / 60) % 60
            var seconds = sec_num % 60

            return [hours, minutes, seconds]
                .map(v => v < 10 ? "0" + v : v)
                .filter((v, i) => v !== "00" || i > 0)
                .join(":")
        } return 'Expired';
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