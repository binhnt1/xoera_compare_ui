import * as _ from 'lodash';
import { version } from 'package.json'
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { NotifyDto } from '../../../_core/domains/objects/notify.dto';
import { AdminUserDto } from '../../../_core/domains/objects/user.dto';
import { UtilityExHelper } from '../../../_core/helpers/utility.helper';
import { AdminApiService } from '../../../_core/services/admin.api.service';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { AdminDataService } from '../../../_core/services/admin.data.service';
import { AdminAuthService } from '../../../_core/services/admin.auth.service';
import { AdminDialogService } from '../../../_core/services/admin.dialog.service';
import { LinkPermissionDto } from '../../../_core/domains/objects/link.permission.dto';
import { ModalViewProfileComponent } from '../../../_core/modal/view.profile/view.profile.component';
import { ModalEditProfileComponent } from '../../../_core/modal/edit.profile/edit.profile.component';
import { ModalChangePasswordComponent } from '../../../_core/modal/change.password/change.password.component';

@Component({
    selector: 'layout-header',
    templateUrl: 'header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class LayoutHeaderComponent implements OnInit {
    active: boolean;
    activeNotify: boolean;

    notifies: NotifyDto[];

    loading: boolean;
    currentUrl: string;
    appVersion = version;
    account: AdminUserDto;
    accountLetter: string;

    constructor(
        public router: Router,
        public data: AdminDataService,
        public authen: AdminAuthService,
        public service: AdminApiService,
        public dialog: AdminDialogService) {
        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                this.currentUrl = val.url;
                this.activeLink();
            }
        });
    }

    ngOnInit() {
        this.loadNotifies();
        this.account = this.authen.account;
        if (this.account) {
            let accountName = this.account.UserName || this.account.Email;
            this.accountLetter = accountName && accountName.substr(0, 1).toUpperCase();
        }
    }

    lock() {
        this.active = false;
        this.authen.lock();
    }

    logout() {
        this.active = false;
        this.authen.logout();
    }

    closeAside() {
        if (this.data.activeMenuHeader) {
            this.data.activeMenuHeader = false;
        }
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

    public popupViewProfile() {
        this.active = false;
        this.dialog.WapperAsync({
            title: 'Profile',
            cancelText: 'Close',
            size: ModalSizeType.Large,
            confirmText: 'Edit profile',
            objectExtra: { admin: true },
            object: ModalViewProfileComponent,
        }, async () => {
            setTimeout(() => {
                this.dialog.WapperAsync({
                    cancelText: 'Close',
                    title: 'Edit profile',
                    confirmText: 'Update',
                    size: ModalSizeType.Large,
                    objectExtra: { admin: true },
                    object: ModalEditProfileComponent,
                });
            }, 100);
        });
    }

    public popupChangepassword() {
        this.active = false;
        this.dialog.WapperAsync({
            confirmText: 'Confirm',
            title: 'Change password',
            objectExtra: { admin: true },
            object: ModalChangePasswordComponent,
        });
    }

    public popupNotify(notify: NotifyDto) {
        let content = notify.Content
            ? '<p>' + notify.Title + '</p><br /><p>' + notify.Content + '</p><br /><p>DateTime: ' + notify.RelativeTime + '</p>'
            : '<p>' + notify.Title + '</p><br /><p>DateTime: <b>' + notify.RelativeTime + '</b></p>';
        this.dialog.Alert('Message', content);
    }

    navigateActivity() {
        this.active = false;
        this.router.navigateByUrl('/admin/useractivity');
    }

    navigate(childItem: LinkPermissionDto) {
        this.active = false;
        UtilityExHelper.clearUrlState();
        this.router.navigateByUrl(childItem.Link);
    }

    private loadNotifies() {
        this.service.notifies().then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                this.notifies = result.Object as NotifyDto[];
            }
        });
    }
}
