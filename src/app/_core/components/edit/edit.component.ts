import * as _ from 'lodash';
import { AppInjector } from '../../../app.module';
import { NavigationEnd, Router } from '@angular/router';
import { ActionData } from '../../domains/data/action.data';
import { MoreActionData } from '../../domains/data/grid.data';
import { HistoryComponent } from './history/history.component';
import { ModalSizeType } from '../../domains/enums/modal.size.type';
import { BreadcrumbData } from '../../domains/data/breadcrumb.data';
import { AdminAuthService } from '../../services/admin.auth.service';
import { AdminDialogService } from '../../services/admin.dialog.service';
import { NavigationStateData } from '../../domains/data/navigation.state';

export abstract class EditComponent {
    params: any;
    router: Router;
    active: boolean;
    processing: boolean;
    loading: boolean = true;
    authen: AdminAuthService;
    state: NavigationStateData;
    actions: ActionData[] = [];
    moreActions: MoreActionData;
    dialogService: AdminDialogService;
    breadcrumbs: BreadcrumbData[] = [];

    constructor() {
        this.dialogService = AppInjector.get(AdminDialogService);
        this.authen = AppInjector.get(AdminAuthService);
        this.router = AppInjector.get(Router);
        this.state = this.getUrlState();
        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                this.breadcrumbs = [];
                let currentUrl = val.url.replace('/edit', '').replace('/add', '');
                if (this.authen && this.authen.links && this.authen.links.length > 0) {
                    this.authen.links.forEach((group: any) => {
                        if (group.items && group.items.length > 0) {
                            group.items.forEach((item: any) => {
                                if (this.breadcrumbs.length == 0) {
                                    if (item.Childrens && item.Childrens.length > 0) {
                                        item.Childrens.forEach((child: any) => {
                                            if (child.Link != '/') {
                                                if (child.Link == currentUrl) {
                                                    if (item.Group)
                                                        this.breadcrumbs.push({ Name: item.Group });
                                                    this.breadcrumbs.push({ Name: item.Name });
                                                    this.breadcrumbs.push({ Name: child.Name, Link: child.Link });
                                                } else if (currentUrl.indexOf(child.Link) >= 0) {
                                                    if (item.Group)
                                                        this.breadcrumbs.push({ Name: item.Group });
                                                    this.breadcrumbs.push({ Name: item.Name });
                                                    this.breadcrumbs.push({ Name: child.Name, Link: child.Link });
                                                }
                                            }
                                        });
                                    } else {
                                        if (item.Link != '/') {
                                            if (item.Link == currentUrl) {
                                                if (item.Group)
                                                    this.breadcrumbs.push({ Name: item.Group });
                                                this.breadcrumbs.push({ Name: item.Name, Link: item.Link });
                                            } else if (currentUrl.indexOf(item.Link) >= 0) {
                                                if (item.Group)
                                                    this.breadcrumbs.push({ Name: item.Group });
                                                this.breadcrumbs.push({ Name: item.Name, Link: item.Link });
                                            }
                                        }
                                    }
                                }
                            });
                        }
                    });
                }
            }
        });
    }

    public back() {
        if (this.state)
            this.router.navigate([this.state.prevUrl], { state: { params: JSON.stringify(this.state) } });
        else
            window.history.back();
    }

    public getParam(key: string) {
        let value = this.params && this.params[key];
        if (value == null || value == undefined)
            value = this.state && this.state[key];
        if (value == null || value == undefined) {
            let queryParams = this.router.parseUrl(this.router.url).queryParams;
            value = queryParams && queryParams[key];
        }
        return value;
    }

    public addBreadcrumb(name: string) {
        this.breadcrumbs.push({ Name: name });
    }

    public getUrlState(): NavigationStateData {
        let stateKey = 'params',
            sessionKey = 'session_' + stateKey,
            navigation = this.router.getCurrentNavigation(),
            valueJson = navigation && navigation.extras && navigation.extras.state
                ? navigation.extras.state[stateKey]
                : sessionStorage.getItem(sessionKey);
        if (valueJson) sessionStorage.setItem(sessionKey, valueJson.toString());
        return JSON.parse(valueJson) as NavigationStateData;
    }

    public viewHistory(id: number, controller: string) {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            object: HistoryComponent,
            title: 'Activity log',
            size: ModalSizeType.ExtraLarge,
            objectExtra: { id: id, type: controller},
        });
    }
}