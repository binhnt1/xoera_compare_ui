declare var $: any
declare var require: any
import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { UtilityExHelper } from '../../../_core/helpers/utility.helper';
import { AdminApiService } from '../../../_core/services/admin.api.service';
import { AdminAuthService } from '../../../_core/services/admin.auth.service';
import { AdminDataService } from '../../../_core/services/admin.data.service';
import { LinkPermissionDto } from '../../../_core/domains/objects/link.permission.dto';

@Component({
    selector: 'layout-aside',
    templateUrl: 'aside.component.html',
    styleUrls: ['./aside.component.scss'],
})
export class LayoutAsideComponent implements OnInit {
    links: any;
    loading: boolean;
    currentUrl: string;

    constructor(
        public router: Router,
        public data: AdminDataService,
        public authen: AdminAuthService,
        public service: AdminApiService) {
        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                this.currentUrl = val.url;
                this.activeLink();
            }
        });
    }

    ngOnInit() {
        this.links = this.authen && this.authen.links?.filter(c => c.key != 'Help/Question');
    }

    closeAside() {
        if (this.data.activeMenuAside) {
            this.data.activeMenuAside = false;
        }
    }

    toggleAside() {
        $('body').toggleClass('kt-aside--minimize');
    }

    activeHover(item: LinkPermissionDto) {
        item.Hover = true;
    }

    hideHover(item: LinkPermissionDto) {
        item.Hover = false;
    }

    toggleActiveLink(item: LinkPermissionDto) {
        item.Active = !item.Active;
    }

    hideActiveLink(item: LinkPermissionDto) {
        item.Active = false;
    }

    private activeLink() {
        if (this.authen.links && this.authen.links.length > 0) {
            this.authen.links.forEach((group: any) => {
                if (group && group.items && group.items.length > 0) {
                    group.items.forEach((item: LinkPermissionDto) => {
                        item.Active = false;
                        if (item.Link == this.currentUrl)
                            item.Active = true;
                        if (item.Childrens && item.Childrens.length > 0) {
                            item.Childrens.forEach((child: LinkPermissionDto) => {
                                child.Active = false;
                                if (child.Link == this.currentUrl) {
                                    item.Active = true;
                                    child.Active = true;
                                }
                            });
                        }
                    });
                }
            });
        }
    }

    navigate(childItem: LinkPermissionDto) {
        this.closeAside();
        UtilityExHelper.clearUrlState();
        this.router.navigateByUrl(childItem.Link);
    }
}
