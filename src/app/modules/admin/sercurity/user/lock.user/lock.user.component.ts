import * as _ from 'lodash';
import { UserService } from '../user.service';
import { AppInjector } from '../../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { validation } from '../../../../../_core/decorators/validator';
import { ResultApi } from '../../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../../_core/helpers/toastr.helper';
import { StringType } from '../../../../../_core/domains/enums/data.type';
import { UserEntity } from '../../../../../_core/domains/entities/user.entity';

@Component({
    templateUrl: './lock.user.component.html',
    styleUrls: [
        './lock.user.component.scss',
        '../../../../../../assets/css/modal.scss'
    ],
})
export class LockUserComponent implements OnInit {
    @Input() params: number;

    active: boolean;
    service: UserService;
    StringType = StringType;
    loading: boolean = true;
    disabled: boolean = true;
    item: UserEntity = new UserEntity();

    constructor() {
        this.service = AppInjector.get(UserService);
    }

    async ngOnInit() {
        await this.loadItem();
        this.loading = false;
    }

    valueChange() {
        this.disabled = this.item.ReasonLock ? false : true;
    }

    private async loadItem() {
        let id = this.params && this.params['id'];
        if (id) {
            await this.service.item('user', id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let obj = result.Object as UserEntity;
                    if (obj) {
                        this.item.FullName = obj.FullName;
                    }
                }
            });
        }
    }

    public async confirm(): Promise<boolean> {
        if (this.item) {
            let id = this.params && this.params['id'];
            if (id) {
                if (await validation(this.item, ['ReasonLock'])) {
                    return await this.service.lockUser(id, this.item.ReasonLock).then((result: ResultApi) => {
                        if (ResultApi.IsSuccess(result)) {
                            ToastrHelper.Success('Lock successfully. Employees have been logged out of the system');
                            return true;
                        } else {
                            ToastrHelper.ErrorResult(result);
                            return false;
                        }
                    }, () => {
                        return false;
                    });
                }
            }
        }
        return false;
    }
}