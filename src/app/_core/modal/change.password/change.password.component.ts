declare var toastr: any;
import * as _ from 'lodash';
import { Component, Input } from '@angular/core';
import { validation } from '../../decorators/validator';
import { ResultApi } from '../../domains/data/result.api';
import { ToastrHelper } from '../../helpers/toastr.helper';
import { AdminDataService } from '../../services/admin.data.service';
import { AdminApiService } from '../../services/admin.api.service';
import { UserActivityHelper } from '../../helpers/user.activity.helper';
import { AdminUserChangePasswordDto } from '../../domains/objects/user.dto';

@Component({
    templateUrl: 'change.password.component.html',
})
export class ModalChangePasswordComponent {
    admin: boolean;
    @Input() params: any;
    item = new AdminUserChangePasswordDto();

    constructor(
        public data: AdminDataService,
        public service: AdminApiService,
        public adminData: AdminDataService,
        public adminService: AdminApiService) {
    }

    public async confirm(): Promise<boolean> {
        let valid = await validation(this.item);
        if (!valid) return false;

        let countryIp = this.admin ? this.adminData.countryIp : this.data.countryIp;
        let entity: AdminUserChangePasswordDto = {
            Activity: await UserActivityHelper.UserActivity(countryIp),
            Password: UserActivityHelper.CreateHash256(this.item.Password),
            OldPassword: UserActivityHelper.CreateHash256(this.item.OldPassword),
            ConfirmPassword: UserActivityHelper.CreateHash256(this.item.ConfirmPassword),
        };
        if (this.admin) {
            return this.adminService.changePassword(entity).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    return true;
                } else {
                    ToastrHelper.ErrorResult(result);
                    return false;
                }
            }, () => {
                return false;
            });
        } else {
            return this.service.changePassword(entity).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    return true;
                } else {
                    ToastrHelper.ErrorResult(result);
                    return false;
                }
            }, () => {
                return false;
            });
        }
    }
}
