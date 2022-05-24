declare var require: any
import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { AdminAuthService } from '../../../../_core/services/admin.auth.service';
import { AdminDataService } from '../../../../_core/services/admin.data.service';
import { UserActivityHelper } from '../../../../_core/helpers/user.activity.helper';
import { AdminUserDto, AdminUserLoginDto } from '../../../../_core/domains/objects/user.dto';

@Component({
    styleUrls: ['./auto.signin.component.scss'],
    templateUrl: './auto.signin.component.html',
})
export class AutoSignInComponent implements OnInit {
    username: string;
    password: string;
    loading: boolean;
    processing: boolean;
    item = new AdminUserLoginDto();

    constructor(
        public router: Router,
        public data: AdminDataService,
        public authen: AdminAuthService,
        public service: AdminApiService,
        public activeedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.activeedRoute.queryParams.subscribe(async params => {
            this.username = params['username'];
            this.password = params['password'];
            this.signIn();
        });
    }

    helpcenter() {
        this.router.navigateByUrl('/helpcenter');
    }

    async signIn(page?: string) {
        if (!page) page = 'helpcenter';
        if (this.username && this.password) {
            this.loading = true;
            this.processing = true;
            let obj: AdminUserLoginDto = {
                UserName: this.username,
                Password: atob(this.password)
            };
            obj.Activity = await UserActivityHelper.UserActivity(this.data.countryIp);
            this.service.signin(obj).then(async (result: ResultApi) => {
                if (ResultApi.IsSuccess(result) && result.Object) {
                    let account = <AdminUserDto>result.Object; account.WebView = true;
                    await this.authen.appLogin(account, true);
                    if (this.authen.account)
                        this.router.navigateByUrl('/' + page);
                } else ToastrHelper.ErrorResult(result);
                setTimeout(() => {
                    this.loading = false;
                    this.processing = false;
                }, 500);
            }, (ex: any) => {
                setTimeout(() => {
                    this.loading = false;
                    this.processing = false;
                }, 500);
                ToastrHelper.Exception(ex);
            });
        } else ToastrHelper.Error('UserName or Password is null or empty');
    }
}
