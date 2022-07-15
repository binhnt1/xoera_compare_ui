import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { UserType } from '../../../../_core/domains/enums/user.type';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { CompanyEntity } from '../../../../_core/domains/entities/company.entity';
import { NavigationStateData } from '../../../../_core/domains/data/navigation.state';
import { InvoicePaymentType } from '../../../../_core/domains/enums/invoice.payment.type';
import { DispatchInvoiceEntity } from '../../../../_core/domains/entities/dispatch.invoice.entity';

@Component({
    templateUrl: './edit.dispatch.invoice.component.html',
    styleUrls: [
        './edit.dispatch.invoice.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditDispatchInvoiceComponent extends EditComponent implements OnInit {
    id: number;
    popup: boolean;
    viewer: boolean;
    @Input() params: any;
    tab: string = 'content';
    loading: boolean = true;
    service: AdminApiService;
    loadingTemplate: boolean = false;
    item: DispatchInvoiceEntity = new DispatchInvoiceEntity();

    constructor() {
        super();
        this.service = AppInjector.get(AdminApiService);
        this.state = this.getUrlState();
    }

    async ngOnInit() {
        this.id = this.params && this.params['id'];
        this.popup = this.params && this.params['popup'];
        this.viewer = this.params && this.params['viewer'];
        if (!this.popup) {
            if (this.state) {
                this.id = this.state.id;
                this.viewer = this.state.viewer;
                this.addBreadcrumb(this.id ? (this.viewer ? 'View' : 'Edit') : 'Add');
            }
            this.renderActions();
        }
        await this.loadItem();
        this.loading = false;
    }

    accountChange() {
        if (this.authen.account.UserType == UserType.Admin) {
            this.service.callApi('user', this.item.AccountId.toString()).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let company: CompanyEntity = result.Object.Company;
                    if (company) {
                        this.item.Phone = company.Phone;
                        this.item.Street = company.Street;
                        this.item.Address = company.Address;
                        this.item.CompanyName = company.Name;
                        this.item.PostCode = company.PostCode;
                        this.item.BuildingNumber = company.BuildingNumber;
                    }

                    if (!this.id) {
                        let date = new Date();
                        date.setDate(date.getDate() + 7);

                        this.item.DueDate = date;
                        this.item.IssueDate = new Date();
                        this.item.PaymentType = InvoicePaymentType.Electrolic;
                        var invoices: DispatchInvoiceEntity[] = result.Object.DispatchInvoices;
                        if (invoices && invoices.length > 0) {
                            let name = company.Name?.substring(0, 2).toUpperCase(),
                                number = invoices.map(c => { return c.Code.replace(name, '') })
                                    .map(c => parseInt(c))
                                    .sort((a, b) => a - b)[0] || 1;
                            this.item.Code = name + number.toString().padStart(4, '0');
                        } else {
                            this.item.Code = company.Name?.substring(0, 2).toUpperCase() + '1'.padStart(4, '0');
                        }
                    }
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
    }

    private async loadItem() {
        this.item = new DispatchInvoiceEntity();
        if (this.id) {
            await this.service.item('dispatchinvoice', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(DispatchInvoiceEntity, result.Object as DispatchInvoiceEntity);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
    }
    private async confirmAndBack() {
        await this.confirm(() => {
            this.back();
        });
    }
    private async renderActions() {
        let actions: ActionData[] = this.id
            ? [
                ActionData.back(() => { this.back() }),
                this.viewer
                    ? ActionData.gotoEdit("Edit", () => { this.edit(this.item) })
                    : ActionData.saveUpdate('Save', () => { this.confirmAndBack() }),
            ]
            : [
                ActionData.back(() => { this.back() }),
                ActionData.saveAddNew('Add new', () => { this.confirmAndBack() })
            ];
        this.actions = await this.authen.actionsAllow(DispatchInvoiceEntity, actions);
    }
    private edit(item: DispatchInvoiceEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevUrl: '/admin/dispatchinvoice',
            prevData: this.state.prevData,
        };
        this.router.navigate(['/admin/dispatchinvoice/edit'], { state: { params: JSON.stringify(obj) } });
    }
    private async confirm(complete: () => void): Promise<boolean> {
        if (this.item) {
            let columns = this.authen.management
                ? ['Code', 'IssueDate', 'Address', 'DueDate', 'AccountId']
                : ['Code', 'IssueDate', 'Address', 'DueDate']
            if (await validation(this.item, columns)) {
                this.processing = true;
                let obj: DispatchInvoiceEntity = _.cloneDeep(this.item);

                // accountId
                if (!obj.AccountId) obj.AccountId = this.authen.account.Id;

                // save
                return await this.service.save('dispatchinvoice', obj).then((result: ResultApi) => {
                    this.processing = false;
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Save invoice success');
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