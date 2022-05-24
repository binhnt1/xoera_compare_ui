import * as _ from 'lodash';
import { RoleService } from '../role.service';
import { AppInjector } from '../../../../../app.module';
import { ResultApi } from '../../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../../_core/helpers/entity.helper';
import { UtilityExHelper } from '../../../../../_core/helpers/utility.helper';
import { RoleEntity } from '../../../../../_core/domains/entities/role.entity';
import { PermissionDto } from '../../../../../_core/domains/objects/permission.dto';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from "@angular/core";

@Component({
    selector: 'edit-permission',
    templateUrl: './edit.permission.component.html',
    styleUrls: [
        './edit.permission.component.scss',
        '../../../../../../assets/css/modal.scss'
    ],
})
export class EditRolePermissionComponent implements OnInit, OnChanges {
    permissions: any[];
    service: RoleService;
    loading: boolean = true;
    item: RoleEntity = new RoleEntity();

    id: number;
    popup: boolean;
    @Input() params: any;
    @Input() items: PermissionDto[];
    @Input() readonly: boolean = false;
    @Output() permissionChange: EventEmitter<PermissionDto[]> = new EventEmitter<PermissionDto[]>();

    constructor() {
        this.service = AppInjector.get(RoleService);
    }

    async ngOnInit() {
        this.id = this.params && this.params['id'];
        this.popup = this.params && this.params['popup'];
        await this.loadItem();
        await this.loadPermissions();
        this.loading = false;
    }

    async ngOnChanges() {
        await this.loadPermissions();
        this.loading = false;
    }

    public async confirm(): Promise<boolean> {
        if (this.item) {
            let permissions = this.items.filter(c => c.Allow).map(c => {
                return {
                    Id: c.Id
                };
            });
            return await this.service.updatePermissions(this.id, permissions).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success('Save data success');
                    return true;
                } else {
                    ToastrHelper.ErrorResult(result);
                    return false;
                }
            }, () => {
                return false;
            });
        }
        return false;
    }

    togglePermission(child: any) {
        if (!child.selected) {
            if (child.permissions && child.permissions.length > 0) {
                child.permissions.forEach((item: PermissionDto) => {
                    item.Allow = false;
                });
            }
            let permissions = this.items.filter(c => c.Allow);
            this.permissionChange.emit(_.cloneDeep(permissions));
        }
    }
    choicePermission() {
        this.permissionChange.emit(_.cloneDeep(this.items.filter(c => c.Allow)));
    }

    private async loadItem() {
        this.item = new RoleEntity();
        if (this.id) {
            await this.service.item('role', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(RoleEntity, result.Object as RoleEntity);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
    }
    private groupPermissions() {
        if (this.items && this.items.length > 0) {
            let groups = _(this.items)
                .groupBy((x: PermissionDto) => x.Group)
                .map((value: PermissionDto[], key: string) => ({ group: key, items: value }))
                .value();
            if (groups && groups.length > 0) {
                groups.forEach((group: any) => {
                    if (group.items && group.items.length > 0) {
                        group.items = _(group.items)
                            .groupBy((x: PermissionDto) => x.Title)
                            .map((value: PermissionDto[], key: string) => ({
                                title: key,
                                permissions: value,
                                id: UtilityExHelper.randomText(8),
                                selected: value.findIndex(c => c.Allow) >= 0,
                            }))
                            .value();
                    }
                });
            }
            this.permissions = groups.map((c: any) => ({
                active: true,
                title: c.group,
                items: c.items,
            }));
        }
    }
    private async loadPermissions() {
        if (this.items) {
            this.groupPermissions();
        } else {
            this.loading = true;
            await this.service.allPermissions(this.id).then((result: ResultApi) => {
                this.loading = false;
                if (ResultApi.IsSuccess(result)) {
                    this.items = result.Object as PermissionDto[];
                    this.groupPermissions();
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
    }
}