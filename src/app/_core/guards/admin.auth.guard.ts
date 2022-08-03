import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AppConfig } from '../helpers/app.config';
import { ActionType } from '../domains/enums/action.type';
import { AdminAuthService } from '../services/admin.auth.service';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AdminUserLoginDto } from '../domains/objects/user.dto';
import { UserActivityHelper } from '../helpers/user.activity.helper';
import { AdminApiService } from '../services/admin.api.service';
import { ResultApi } from '../domains/data/result.api';
import { ResultType } from '../domains/enums/result.type';

@Injectable({ providedIn: 'root' })
export class AdminAuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private service: AdminApiService,
        private authService: AdminAuthService) {
        AppConfig.setEnvironment();
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        let queries = location.href.split('?'),
            queryParams = queries && queries.length >= 2
                ? queries[1].split('&')
                : null,
            username = queryParams && queryParams.length >= 2
                ? queryParams.find(c => c.indexOf('username') >= 0)?.split('=')[1]
                : null,
            password = queryParams && queryParams.length >= 2
                ? queryParams.find(c => c.indexOf('password') >= 0)?.split('=')[1]
                : null;
        if (username && password) {
            let obj: AdminUserLoginDto = {
                UserName: username,
                Password: UserActivityHelper.CreateHash256(password)
            };
            return this.service.adminSignin(obj).then(async (result: ResultApi) => {
                if (result && result.Type == ResultType.Success) {
                    await this.authService.login(result.Object, true);
                    return true;
                }
                return false;
            }, () => {
                return false;
            });
        }
        else {
            let account = this.authService.account,
                stateUrl = state.url.replace('/admin', '');
            stateUrl = stateUrl.replace('/account', '/user');
            stateUrl = stateUrl.replace('/customer', '/user');
            if (account) {
                if (account.Locked) {
                    if (stateUrl.indexOf('/admin/lock') == -1) {
                        this.router.navigate(['/admin/lock'], { queryParams: { returnUrl: state.url } });
                    }
                    return false;
                }
                let urls = stateUrl.split('/').filter(c => c != null && c.length > 0),
                    controller = urls[0],
                    action = urls[1];

                return new Promise((resolve, reject) => {
                    let actionType = ActionType.View;
                    if (action) {
                        if (action == 'edit') actionType = ActionType.Edit;
                    }
                    this.authService.permissionAllow(controller, actionType).then((allow: boolean) => {
                        if (allow) {
                            resolve(true);
                        }
                        else {
                            resolve(false);
                            this.router.navigate(['/admin/error/403']);
                        }
                    });
                });
            } else {
                let url = state.url.indexOf('/admin/lock') >= 0 ? '/' : state.url;
                this.router.navigate(['/admin/signin'], { queryParams: { returnUrl: url } });
                return false;
            }
        }
    }
}