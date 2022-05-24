declare var $: any
declare var require: any
import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ApiService } from '../../../_core/services/api.service';
import { AuthService } from '../../../_core/services/auth.service';
import { DataService } from '../../../_core/services/data.service';
import { UtilityExHelper } from '../../../_core/helpers/utility.helper';
import { LinkPermissionDto } from '../../../_core/domains/objects/link.permission.dto';

@Component({
    selector: 'layout-client-aside',
    templateUrl: 'aside.component.html',
    styleUrls: ['./aside.component.scss'],
})
export class LayoutAsideComponent implements OnInit {
    loading: boolean;
    currentUrl: string;

    constructor(
        public router: Router,
        public data: DataService,
        public authen: AuthService,
        public service: ApiService) {
        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                this.currentUrl = val.url;
                this.activeLink();
            }
        });
    }

    ngOnInit() {
        
    }

    closeAside() {
        if (this.data.activeMenuAside) {
            this.data.activeMenuAside = false;
        }
    }

    toggleAside() {
        $('body').toggleClass('kt-aside--minimize');
    }

    toggleActiveLink(item: LinkPermissionDto) {
        item.Active = !item.Active;
    }

    private activeLink() {
        if (this.authen.links && this.authen.links.length > 0) {
            this.authen.links.forEach((group: any) => {
                if (group && group.items && group.items.length > 0) {
                    group.items.forEach((item: LinkPermissionDto) => {
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
