declare var require: any
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AppConfig } from '../helpers/app.config';
import { UserType } from '../domains/enums/user.type';
import { AdminApiService } from './admin.api.service';
import { ResultApi } from '../domains/data/result.api';
import { ActionData } from '../domains/data/action.data';
import { ActionType } from '../domains/enums/action.type';
import { AdminUserDto } from '../domains/objects/user.dto';
import { UtilityExHelper } from '../helpers/utility.helper';
import { DecoratorHelper } from '../helpers/decorator.helper';
import { PermissionEntity } from '../domains/entities/permission.entity';
import { LinkPermissionDto } from '../domains/objects/link.permission.dto';
import { LinkPermissionEntity } from '../domains/entities/link.permission.entity';

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
    public links: any[];
    public clientLinks: any[];
    public permissions: PermissionEntity[];
    private accountSubject: BehaviorSubject<AdminUserDto>;

    constructor(
        public router: Router,
        public service: AdminApiService) {
        let json = sessionStorage.getItem(AppConfig.AdminAccountTokenKey);
        if (!json) json = localStorage.getItem(AppConfig.AdminAccountTokenKey);
        if (json) this.accountSubject = new BehaviorSubject<AdminUserDto>(JSON.parse(json));
    }

    public get account(): AdminUserDto {
        return this.accountSubject && this.accountSubject.value;
    }

    public get management(): boolean {
        return this.account.IsAdmin || this.account.UserType == UserType.Admin
    }

    public async lock() {
        let account = this.account;
        this.account.Locked = true;
        if (this.accountSubject) this.accountSubject.next(account);
        else this.accountSubject = new BehaviorSubject<AdminUserDto>(account);

        let json = sessionStorage.getItem(AppConfig.AdminAccountTokenKey);
        if (json) sessionStorage.setItem(AppConfig.AdminAccountTokenKey, JSON.stringify(account));
        else {
            json = localStorage.getItem(AppConfig.AdminAccountTokenKey);
            localStorage.setItem(AppConfig.AdminAccountTokenKey, JSON.stringify(account));
        }

        // Redirect
        this.router.navigate(['admin/lock'], { queryParams: { returnUrl: this.router.url } });
    }
    public async logout(navigate: boolean = true) {
        localStorage.removeItem(AppConfig.AdminAccountTokenKey);
        sessionStorage.removeItem(AppConfig.AdminAccountTokenKey);
        if (this.accountSubject) this.accountSubject.next(null);

        // Redirect
        if (navigate) {
            this.router.navigate(['admin/signin'], { queryParams: { returnUrl: this.router.url } });
        }
    }
    public async login(account: AdminUserDto, rememberMe: boolean = true) {
        if (account) {
            account.Locked = false;
            if (this.accountSubject) this.accountSubject.next(account);
            else this.accountSubject = new BehaviorSubject<AdminUserDto>(account);

            if (rememberMe)
                localStorage.setItem(AppConfig.AdminAccountTokenKey, JSON.stringify(account));
            else
                sessionStorage.setItem(AppConfig.AdminAccountTokenKey, JSON.stringify(account));

            // Redirect
            let queryParams = this.router.parseUrl(this.router.url).queryParams,
                url: string = (queryParams && queryParams['returnUrl']) || '/admin';
            if (url.indexOf('/error') >= 0) url = '/admin';
            window.location.href = url;
        }
    }
    public async appLogin(account: AdminUserDto, rememberMe: boolean = true) {
        if (account) {
            account.Locked = false;
            if (this.accountSubject) this.accountSubject.next(account);
            else this.accountSubject = new BehaviorSubject<AdminUserDto>(account);

            if (rememberMe)
                localStorage.setItem(AppConfig.AdminAccountTokenKey, JSON.stringify(account));
            else
                sessionStorage.setItem(AppConfig.AdminAccountTokenKey, JSON.stringify(account));
        }
    }

    public async loadAuthenData() {
        if (!this.links || this.links.length == 0) {
            await this.loadLinkPermissions();
        }
        if (!this.permissions || this.permissions.length == 0) {
            await this.loadPermissions();
        }
    }

    public async actionsAllow(reference: new () => {}, actions: ActionData[]) {
        let result: ActionData[] = [];
        let table = DecoratorHelper.decoratorClass(reference);
        actions.forEach(async (item: ActionData) => {
            if (item.systemName == ActionType.History) {
                let controller = item.controllerName || table.name;
                let allow = await this.permissionAllow(controller, ActionType.View);
                if (allow) {
                    result.push(item);
                }
            } else {
                let controller = item.controllerName || table.name;
                let allow = await this.permissionAllow(controller, item.systemName);
                if (allow) {
                    result.push(item);
                }
            }
        });
        return result;
    }
    public async permissionAllow(controller: string, action?: string): Promise<boolean> {
        await this.loadAuthenData();
        if (action == ActionType.Empty) return true;
        if (controller == 'useractivity') return true;
        if (this.account && this.account.IsAdmin) return true;
        if (!controller && (!action || action == ActionType.View.toString()))
            return true;
        if (!action) action = ActionType.View;
        if (controller) controller = UtilityExHelper.trimChar(controller.toLowerCase(), '/');
        if (controller && action && this.permissions) {
            let item = this.permissions
                .filter(c => c.Controller.toLowerCase() == controller)
                .find(c => c.Action.toLowerCase() == action.toLowerCase());
            if (item) return true;
        }
        return false;
    }

    private async loadPermissions() {
        await this.service.permissions().then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                this.permissions = result.Object as PermissionEntity[];
            }
        });
    }
    private async loadLinkPermissions() {
        await this.service.linkPermissions().then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                let items = result.Object as LinkPermissionEntity[];
                this.links = _(items)
                    .filter((c: LinkPermissionEntity) => c.Group)
                    .groupBy((c: LinkPermissionEntity) => c.Group)
                    .map((value, key) => ({ key: key, items: value }))
                    .value();
                this.links.forEach((item: any) => {
                    if (item.items && item.items.length > 0) {
                        let array: LinkPermissionDto[] = [];
                        item.items.forEach((itm: LinkPermissionEntity) => {
                            if (!itm.ParentId) {
                                let itmDto: LinkPermissionDto = {
                                    Active: false,
                                    Name: itm.Name,
                                    Link: itm.Link,
                                    Group: itm.Group,
                                    Order: itm.Order,
                                    CssIcon: itm.CssIcon,
                                    ParentId: itm.ParentId,
                                    Childrens: items.filter(c => c.ParentId == itm.Id),
                                };
                                array.push(itmDto);
                            }
                        });
                        item.items = array;
                    }
                });
                setTimeout(() => {
                }, 1000);
            }
        });
    }
}