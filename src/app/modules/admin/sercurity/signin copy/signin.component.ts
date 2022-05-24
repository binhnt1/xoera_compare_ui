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
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { AdminAuthService } from '../../../../_core/services/admin.auth.service';
import { AdminDataService } from '../../../../_core/services/admin.data.service';
import { AdminEventService } from '../../../../_core/services/admin.event.service';
import { UserActivityHelper } from '../../../../_core/helpers/user.activity.helper';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { ForgotPasswordComponent } from './forgot.password/forgot.password.component';

@Component({
    styleUrls: ['./signin.component.scss'],
    templateUrl: './signin.component.html',
})
export class SignInComponent implements OnInit {
    processing: boolean;
    item = new AdminUserLoginDto();

    constructor(
        public router: Router,
        public data: AdminDataService,
        public event: AdminEventService,
        public authen: AdminAuthService,
        public service: AdminApiService,
        public dialog: AdminDialogService,
        public activeedRoute: ActivatedRoute) {
        this.activeedRoute.queryParams.subscribe(params => {
            let forgot = params['forgot'];
            if (forgot)  {
                setTimeout(() => {
                    this.forgotPassword();
                }, 500);
            }
                
        });
    }

    ngOnInit() {
        if (this.authen.account && !this.authen.account.Locked)
            this.router.navigateByUrl('/admin');
    }

    submitSignIn(e: any) {
        if (e && e.keyCode === 13) {
            this.signin();
        }
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
                    await this.authen.login(result.Object, this.item.RememberMe);
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

    forgotPassword() {
        this.dialog.WapperAsync({
            cancelText: 'Cancel',
            confirmText: 'Confirm',
            title: 'Forgot password',
            size: ModalSizeType.Medium,
            object: ForgotPasswordComponent
        }, async () => {
            this.dialog.Alert('Message', 'The system has sent a password reset email to your mailbox');
        });
    }
}
