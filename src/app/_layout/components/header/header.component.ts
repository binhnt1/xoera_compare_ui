import * as _ from 'lodash';
import { version } from 'package.json'
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ApiService } from '../../../_core/services/api.service';
import { UserDto } from '../../../_core/domains/objects/user.dto';
import { DataService } from '../../../_core/services/data.service';
import { AuthService } from '../../../_core/services/auth.service';
import { ResultApi } from '../../../_core/domains/data/result.api';
import { NotifyDto } from '../../../_core/domains/objects/notify.dto';
import { UtilityExHelper } from '../../../_core/helpers/utility.helper';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { AdminDialogService } from '../../../_core/services/admin.dialog.service';
import { LinkPermissionDto } from '../../../_core/domains/objects/link.permission.dto';
import { ModalViewProfileComponent } from '../../../_core/modal/view.profile/view.profile.component';
import { ModalEditProfileComponent } from '../../../_core/modal/edit.profile/edit.profile.component';
import { ModalChangePasswordComponent } from '../../../_core/modal/change.password/change.password.component';

@Component({
    selector: 'layout-client-header',
    templateUrl: 'header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class LayoutHeaderComponent implements OnInit {
    active: boolean;
    activeNotify: boolean;
    notifies: NotifyDto[];

    account: UserDto;
    loading: boolean;
    currentUrl: string;
    appVersion = version;
    accountLetter: string;

    constructor(
        public router: Router,
        public data: DataService,
        public authen: AuthService,
        public service: ApiService,
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
            let accountName = this.account.FullName || this.account.Email;
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
            objectExtra: { admin: false },
            object: ModalViewProfileComponent,
        }, async () => {
            setTimeout(() => {
                this.dialog.WapperAsync({
                    cancelText: 'Close',
                    title: 'Edit profile',
                    confirmText: 'Update',
                    size: ModalSizeType.Large,
                    objectExtra: { admin: false },
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
            objectExtra: { admin: false },
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
        this.router.navigateByUrl('/useractivity');
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
