declare var require: any
import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    styleUrls: ['./reset.password.component.scss'],
    templateUrl: './reset.password.component.html',
})
export class ResetPasswordComponent implements OnInit {
    code: string;
    processing: boolean;
    loading: boolean = true;
    item = new AdminUserLoginDto();

    constructor(
        public router: Router,
        public data: AdminDataService,
        public event: AdminEventService,
        public authen: AdminAuthService,
        public service: AdminApiService,
        public dialog: AdminDialogService,
        public activeedRoute: ActivatedRoute) {
        if (this.authen.account && !this.authen.account.Locked)
            this.router.navigateByUrl('/admin');
        this.activeedRoute.queryParams.subscribe(params => {
            this.code = params['code'];
        });
    }

    ngOnInit() {
        if (!this.code) {
            this.dialog.Alert('Message', 'Verify code is incorrect or invalid', true);
            this.loading = false;
            return;
        }
        this.service.checkVerify(this.code).then((result: ResultApi) => {
            this.loading = false;
            if (ResultApi.IsSuccess(result) && result.Object) {
                this.item.UserName = result.Object as string;
            } else {
                this.dialog.Alert('Message', 'Wrong link or expired! Please get the new link <a href="/admin/signin?forgot=1"> here </a>', true);
            }
        });
    }

    submitSignIn(e: any) {
        if (e && e.keyCode === 13) {
            this.verify();
        }
    }

    async verify() {
        let valid = await validation(this.item);
        if (valid) {
            this.processing = true;
            let password = UserActivityHelper.CreateHash256(this.item.Password);
            this.service.verify(this.code, password).then(async (result: ResultApi) => {
                if (result && result.Type == ResultType.Success) {
                    this.dialog.AlertTimeOut('Message', 'Update password success, please login to use the system', 5, true);
                    setTimeout(async () => {
                        this.router.navigateByUrl('/admin');
                    }, 5000);
                } else ToastrHelper.ErrorResult(result);
                this.processing = false;
            }, (ex: any) => {
                this.processing = false;
                ToastrHelper.Exception(ex);
            });
        }
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
}
