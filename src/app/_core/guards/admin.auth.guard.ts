import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AppConfig } from '../helpers/app.config';
import { ActionType } from '../domains/enums/action.type';
import { AdminAuthService } from '../services/admin.auth.service';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AdminAuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AdminAuthService) {
        AppConfig.setEnvironment();
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const account = this.authService.account;
        if (account) {
            let stateUrl = state.url.replace('/admin', '');
            let urls = stateUrl.split('/').filter(c => c != null && c.length > 0),
                controller = urls[0],
                action = urls[1];
            if (controller == 'account' || controller == 'customer')
                controller = 'user';
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
                        this.router.navigate(['/admin/error/503']);
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