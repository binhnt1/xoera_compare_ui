declare var require: any
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AppConfig } from '../helpers/app.config';
import { UserDto } from '../domains/objects/user.dto';
import { ResultApi } from '../domains/data/result.api';
import { PermissionEntity } from '../domains/entities/permission.entity';
import { LinkPermissionDto } from '../domains/objects/link.permission.dto';
import { LinkPermissionEntity } from '../domains/entities/link.permission.entity';

@Injectable({ providedIn: 'root' })
export class AuthService {
    public links: any[];
    public clientLinks: any[];
    public permissions: PermissionEntity[];
    private accountSubject: BehaviorSubject<UserDto>;

    constructor(
        private router: Router,
        private service: ApiService) {
        let json = sessionStorage.getItem(AppConfig.AccountTokenKey);
        if (!json) json = localStorage.getItem(AppConfig.AccountTokenKey);
        if (json) this.accountSubject = new BehaviorSubject<UserDto>(JSON.parse(json));
    }

    public get account(): UserDto {
        return this.accountSubject && this.accountSubject.value;
    }

    public async lock() {
        let account = this.account;
        this.account.Locked = true;
        if (this.accountSubject) this.accountSubject.next(account);
        else this.accountSubject = new BehaviorSubject<UserDto>(account);

        let json = sessionStorage.getItem(AppConfig.AccountTokenKey);
        if (json) sessionStorage.setItem(AppConfig.AccountTokenKey, JSON.stringify(account));
        else {
            json = localStorage.getItem(AppConfig.AccountTokenKey);
            localStorage.setItem(AppConfig.AccountTokenKey, JSON.stringify(account));
        }

        // Redirect
        this.router.navigate(['lock'], { queryParams: { returnUrl: this.router.url } });
    }
    public async logout(navigate: boolean = true) {
        localStorage.removeItem(AppConfig.AccountTokenKey);
        sessionStorage.removeItem(AppConfig.AccountTokenKey);
        if (this.accountSubject) this.accountSubject.next(null);

        // Redirect
        if (navigate) this.router.navigate(['signin'], { queryParams: { returnUrl: this.router.url } });
    }
    public async login(account: UserDto, rememberMe: boolean = true) {
        if (account) {
            account.Locked = false;
            if (this.accountSubject) this.accountSubject.next(account);
            else this.accountSubject = new BehaviorSubject<UserDto>(account);

            if (rememberMe)
                localStorage.setItem(AppConfig.AccountTokenKey, JSON.stringify(account));
            else
                sessionStorage.setItem(AppConfig.AccountTokenKey, JSON.stringify(account));

            // Redirect
            let queryParams = this.router.parseUrl(this.router.url).queryParams,
                url: string = (queryParams && queryParams['returnUrl']) || '/admin';
            if (url.indexOf('/error') >= 0) url = '/admin';
            window.location.href = url;
        }
    }

    public async loadAuthenData() {
        if (!this.links || this.links.length == 0) {
            await this.loadLinkPermissions();
        }
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