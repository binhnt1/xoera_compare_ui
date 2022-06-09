import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { MethodType } from '../../../../_core/domains/enums/method.type';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { CustomerDto } from '../../../../_core/domains/objects/customer.dto';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { UserActivityHelper } from '../../../../_core/helpers/user.activity.helper';

@Component({
    templateUrl: './edit.customer.component.html',
    styleUrls: [
        './edit.customer.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditCustomerComponent extends EditComponent implements OnInit {
    id: number;
    popup: boolean;
    viewer: boolean;
    @Input() params: any;
    loading: boolean = true;
    service: AdminApiService;
    item: CustomerDto = new CustomerDto();

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
                this.addBreadcrumb(this.id ? 'Edit' : 'Add');
            }
        }
        await this.loadItem();
        this.loading = false;
    }

    private async loadItem() {
        this.item = new CustomerDto();
        if (this.id) {
            await this.service.item('company', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(CustomerDto, result.Object as CustomerDto);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
    }
    public async confirm(complete: () => void): Promise<boolean> {
        if (this.item) {
            let columns = this.authen.management 
                ? ['OwnerIds', 'FullName', 'Phone', 'Email']
                : ['FullName', 'Phone', 'Email'];
            if (await validation(this.item, columns)) {
                this.processing = true;
                let obj: CustomerDto = _.cloneDeep(this.item);

                // save
                obj.RawPassword = UtilityExHelper.randomText(6);
                obj.Password = UserActivityHelper.CreateHash256(obj.RawPassword);
                return await this.service.callApi('user',  'adminCreateCustomer', obj, MethodType.Put).then((result: ResultApi) => {
                    this.processing = false;
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Create customer success');
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