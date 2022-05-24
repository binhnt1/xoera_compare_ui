declare var require: any
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AppConfig } from '../helpers/app.config';
import { AdminApiService } from './admin.api.service';
import { ResultApi } from '../domains/data/result.api';
import { ActionData } from '../domains/data/action.data';
import { ActionType } from '../domains/enums/action.type';
import { AdminUserDto } from '../domains/objects/user.dto';
import { UtilityExHelper } from '../helpers/utility.helper';
import { DecoratorHelper } from '../helpers/decorator.helper';
import { LinkPermissionDto } from '../domains/objects/link.permission.dto';
import { LinkPermissionEntity } from '../domains/entities/link.permission.entity';

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
    public links: any[];
    public clientLinks: any[];
    public permissions: string[];
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
        let webview = this.account?.WebView;
        localStorage.removeItem(AppConfig.AdminAccountTokenKey);
        sessionStorage.removeItem(AppConfig.AdminAccountTokenKey);
        if (this.accountSubject) this.accountSubject.next(null);

        // Redirect
        if (navigate) {
            if (webview) this.router.navigateByUrl('/helpcenter');
            else this.router.navigate(['admin/signin'], { queryParams: { returnUrl: this.router.url } });
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
        if (!controller) return true;
        if (this.account.IsAdmin) return true;

        action = this.correctAction(action);
        controller = this.correctController(controller);
        let allows = ["audit", "notify", "helpcenter", "helpquestion", "sentitem"];
        if (allows.indexOf(action.toLowerCase()) >= 0)
            return true;
        if (allows.indexOf(controller.toLowerCase()) >= 0)
            return true;
        if (controller && action && this.permissions) {
            let permissionName = this.correctPermission(controller, action);
            let item = this.permissions.find(c => c.toLowerCase() == permissionName);
            if (item) return true;
        }
        return false;
    }

    private correctAction(action: string) {
        if (!action) action = ActionType.View;
        if (action == ActionType.AddNew) action = 'Add';
        return action.toLowerCase();
    }
    private correctController(controller: string) {
        controller = UtilityExHelper.trimChar(controller.toLowerCase(), '/');
        switch (controller) {
            case "broker":
                controller = "agency";
                break;
            case "agencynote":
            case "agencycontact":
            case "agencyaddress":
            case "agencydocument":
            case "agencycommission":
            case "agencybankaccount":
                controller = "agency";
                break;
            case "brokerleadtemp":
                controller = "brokerlead";
                break;
            case "hubfilesummary":
                controller = "hubfile";
                break;
            case "meter":
            case "meterread":
            case "meterpoint":
                controller = "site";
                break;
        }
        return controller.toLowerCase();
    }
    private correctPermission(controller: string, action: string) {
        let permissionName = action + controller;
        switch (controller) {
            case 'site': {
                switch (action) {
                    case 'test': permissionName = 'viewfileflowcontenttest'; break;
                }
            } break;
            case 'hubfile': {
                switch (action) {
                    case 'view': permissionName = 'viewfileflowhub'; break;
                    case 'test': permissionName = 'viewfileflowvalidationtest'; break;
                    default: {
                        if (action.indexOf('test') > 0)
                            permissionName = 'viewfileflowvalidationtest';
                        else if (action.indexOf('reports') > 0)
                            permissionName = 'viewfileflowreport';
                        else
                            permissionName = 'viewfileflowhub';
                    } break;
                }
            } break;
            case 'sendemail': permissionName = 'sendBulkEmail'.toLowerCase(); break;
            case 'smtpaccount': permissionName = 'editSystemSetting'.toLowerCase(); break;
            case 'helpquestion': permissionName = 'editSystemSetting'.toLowerCase(); break;
            case 'linkpermission': permissionName = 'editSystemSetting'.toLowerCase(); break;
            case 'hubfilevalidation': permissionName = 'editSystemSetting'.toLowerCase(); break;
        }
        return permissionName;
    }

    private async loadPermissions() {
        await this.service.permissions().then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                this.permissions = result.Object as string[];
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