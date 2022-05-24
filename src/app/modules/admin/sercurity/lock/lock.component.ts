declare var require: any
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { ResultType } from '../../../../_core/domains/enums/result.type';
import { AdminUserLoginDto } from '../../../../_core/domains/objects/user.dto';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { AdminAuthService } from '../../../../_core/services/admin.auth.service';
import { AdminDataService } from '../../../../_core/services/admin.data.service';
import { AdminEventService } from '../../../../_core/services/admin.event.service';
import { UserActivityHelper } from '../../../../_core/helpers/user.activity.helper';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';

@Component({
    styleUrls: ['./lock.component.scss'],
    templateUrl: './lock.component.html',
})
export class LockComponent implements OnInit {
    processing: boolean;
    item = new AdminUserLoginDto();

    constructor(
        public router: Router,
        public data: AdminDataService,
        public event: AdminEventService,
        public authen: AdminAuthService,
        public service: AdminApiService,
        public dialog: AdminDialogService) {
        this.item.UserName = this.authen.account && this.authen.account.UserName;
    }

    ngOnInit() {
        if (!this.authen.account) {
            this.router.navigateByUrl('/admin/signin');
            return;
        }
        if (this.authen.account && !this.authen.account.Locked)
            this.router.navigateByUrl('/admin');
    }

    submitSignIn(e: any) {
        if (e && e.keyCode === 13) {
            this.signin();
        }
    }

    signOut() {
        this.authen.logout();
    }

    signUp() {
        this.dialog.Alert('Message', 'Please contact <b>Admin</b> to register user');
    }

    tutorial() {
        this.dialog.Alert('Message', 'Please contact <b>Admin</b> to get tutorial');
    }

    contact() {
        this.dialog.Alert('Message', 'Please contact <b>Admin</b>');
    }

    async signin() {
        let valid = await validation(this.item, ['UserName', 'Password']);
        if (valid) {
            this.processing = true;
            let obj: AdminUserLoginDto = _.cloneDeep(this.item);
            obj.Password = UserActivityHelper.CreateHash256(obj.Password);
            obj.Activity = await UserActivityHelper.UserActivity(this.data.countryIp);
            this.service.signin(obj).then(async (result: ResultApi) => {
                if (result && result.Type == ResultType.Success) {
                    await this.authen.login(result.Object);
                } else ToastrHelper.ErrorResult(result);
                this.processing = false;
            }, (ex: any) => {
                this.processing = false;
                ToastrHelper.Exception(ex);
            });
        }
    }
}
