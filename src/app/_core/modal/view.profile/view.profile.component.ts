declare var toastr: any;
import * as _ from 'lodash';
import { ApiService } from '../../services/api.service';
import { Component, Input, OnInit } from '@angular/core';
import { ResultApi } from '../../domains/data/result.api';
import { EntityHelper } from '../../helpers/entity.helper';
import { AdminApiService } from '../../services/admin.api.service';
import { AdminUserProfileDto, UserProfileDto } from '../../domains/objects/user.dto';

@Component({
    templateUrl: 'view.profile.component.html',
})
export class ModalViewProfileComponent implements OnInit {
    admin: boolean;
    @Input() params: any;
    loading: boolean = true;
    item = new AdminUserProfileDto();

    constructor(
        public service: ApiService,
        public adminService: AdminApiService) {
    }

    async ngOnInit() {
        this.admin = this.params && this.params['admin'];
        await this.loadItem();
        this.loading = false;
    }

    async confirm() {
        return true;
    }

    private async loadItem() {
        if (this.admin) {
            await this.adminService.profile().then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(AdminUserProfileDto, result.Object);
                }
            });
        } else {
            await this.service.profile().then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(UserProfileDto, result.Object);
                }
            });
        }
    }
}
