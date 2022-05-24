declare var toastr: any;
import * as _ from 'lodash';
import { ApiService } from '../../services/api.service';
import { validation } from '../../decorators/validator';
import { ResultApi } from '../../domains/data/result.api';
import { EntityHelper } from '../../helpers/entity.helper';
import { ToastrHelper } from '../../helpers/toastr.helper';
import { EditorComponent } from '../../editor/editor.component';
import { AdminApiService } from '../../services/admin.api.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AdminUserProfileDto, UserProfileDto } from '../../domains/objects/user.dto';

@Component({
    templateUrl: 'edit.profile.component.html',
})
export class ModalEditProfileComponent implements OnInit {
    admin: boolean;
    @Input() params: any;
    loading: boolean = true;
    item = new AdminUserProfileDto();
    @ViewChild('uploadAvatar') uploadAvatar: EditorComponent;

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
        let valid = await validation(this.item, ['FullName', 'Phone']);
        if (valid) {
            // upload
            let images = await this.uploadAvatar.image.upload();

            // save profile
            let obj = _.cloneDeep(this.item);
            obj.Avatar = images && images.length > 0 ? images[0].Path : '';
            if (this.admin) {
                return await this.adminService.updateProfile(obj).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Update profile success');
                        return true;
                    } else {
                        ToastrHelper.ErrorResult(result);
                        return false;
                    }
                }, () => {
                    return false;
                });
            } else {
                return await this.service.updateProfile(obj).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Update profile success');
                        return true;
                    } else {
                        ToastrHelper.ErrorResult(result);
                        return false;
                    }
                }, () => {
                    return false;
                });
            }
        } return false;
    }

    private async loadItem() {
        let admin = this.params && this.params['admin'];
        if (admin) {
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
