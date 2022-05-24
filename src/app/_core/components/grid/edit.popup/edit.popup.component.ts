import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Subscription } from "rxjs/internal/Subscription";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { GridData } from '../../../../_core/domains/data/grid.data';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { DialogData } from '../../../../_core/domains/data/dialog.data';
import { DialogType } from '../../../../_core/domains/enums/dialog.type';
import { ButtonType } from '../../../../_core/domains/enums/button.type';
import { ObjectEx } from '../../../../_core/decorators/object.decorator';
import { StringEx } from '../../../../_core/decorators/string.decorator';
import { DecoratorHelper } from '../../../../_core/helpers/decorator.helper';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { DataType, StringType } from '../../../../_core/domains/enums/data.type';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';

@Component({
    selector: 'edit-popup',
    templateUrl: './edit.popup.component.html',
    styleUrls: ['../../../../../assets/css/modal.scss'],
})
export class GridEditPopupComponent implements OnInit, OnDestroy {
    item: any;
    obj: GridData;
    loading: boolean;
    disabled: boolean;
    sizeClass: string;
    dialog: DialogData;
    processing: boolean;
    confirmText: string;
    properties: ObjectEx[];
    ButtonType = ButtonType;
    DialogType = DialogType;
    visible: boolean = false;
    service: AdminApiService;
    @Input() columns: string[];
    eventDialog: Subscription = null;
    dialogService: AdminDialogService;
    columnClass = new Map<string, string>();

    constructor() {
        this.service = AppInjector.get(AdminApiService);
        this.dialogService = AppInjector.get(AdminDialogService);
    }

    ngOnInit() {
        if (this.eventDialog == null) {
            this.eventDialog = this.dialogService.EventDialog.subscribe((item: DialogData) => {
                if (item.type == DialogType.AdminEdit) {
                    this.init(item);
                    this.disabled = false;
                    this.confirmText = (item.object ? 'Update ' : 'Create ') + this.obj.Title;
                    if (!this.dialog.title) this.dialog.title = (item.object ? 'Edit ' : 'Add new ') + this.obj.Title;
                } else if (item.type == DialogType.AdminView) {
                    this.init(item);
                    this.disabled = true;
                    if (!this.dialog.title) this.dialog.title = 'View ' + this.obj.Title;
                }
            });
            this.dialogService.EventHideDialog.subscribe((item: DialogData) => {
                this.visible = false;
            });
        }
    }

    ngOnDestroy() {
        if (this.eventDialog != null) {
            this.eventDialog.unsubscribe();
            this.eventDialog = null;
            this.visible = false;
        }
    }

    public close() {
        if (this.dialog) {
            this.visible = false;
            if (this.dialog.cancelFunction)
                this.dialog.cancelFunction();
        }
    }

    async confirm() {
        if (this.obj && this.obj.Reference) {
            let table = DecoratorHelper.decoratorClass(this.obj.Reference);
            if (this.dialog) {
                if (await validation(this.item)) {
                    this.processing = true;
                    this.service.save(table.name, this.item).then((result: ResultApi) => {
                        this.processing = false;
                        if (ResultApi.IsSuccess(result)) {
                            this.visible = false;
                            if (this.dialog.okFunction)
                                this.dialog.okFunction();
                            let message = (this.item.Id ? 'Edit ' : 'Add new ') + this.obj.Title.toLowerCase() + ' success';
                            ToastrHelper.Success(message);
                        } else ToastrHelper.ErrorResult(result);
                    });
                }
            }
        }
    }

    async loadItem(id?: number) {
        if (this.obj && this.obj.Reference) {
            let table = DecoratorHelper.decoratorClass(this.obj.Reference);
            if (id) {
                await this.service.item(table.name, id).then((result: ResultApi) => {
                    this.loading = false;
                    if (ResultApi.IsSuccess(result)) {
                        this.item = EntityHelper.createEntity(this.obj.Reference, result.Object);
                    } else {
                        this.visible = false;
                        ToastrHelper.ErrorResult(result);
                    }
                }, () => {
                    this.visible = false;
                    this.loading = false;
                });
            }
            else this.item = EntityHelper.createEntity(this.obj.Reference);
        }
    }

    async init(item: DialogData) {
        this.dialog = item;
        this.visible = true;
        this.loading = true;
        this.obj = _.cloneDeep(item.objectExtra);

        if (this.obj && this.obj.Reference) {
            this.properties = [];
            let properties = DecoratorHelper.decoratorProperties(this.obj.Reference, false);
            properties.forEach((property: ObjectEx) => {
                switch (this.obj.Size) {
                    case ModalSizeType.Small:
                        this.sizeClass = 'modal-sm';
                        this.columnClass.set(property.property, 'col-sm-12');
                        break;
                    case ModalSizeType.Large:
                        this.sizeClass = 'modal-lg';
                        if (property.dataType == DataType.String && (<StringEx>property).type == StringType.MultiText)
                            this.columnClass.set(property.property, 'col-sm-12');
                        else
                            this.columnClass.set(property.property, 'col-sm-6');
                        break;
                    case ModalSizeType.ExtraLarge:
                        this.sizeClass = 'modal-xl';
                        this.columnClass.set(property.property, 'col-sm-4');
                        break;
                    case ModalSizeType.FullScreen:
                        this.sizeClass = 'modal-fs';
                        this.columnClass.set(property.property, 'col-sm-3');
                        break;
                    case ModalSizeType.Medium:
                        this.sizeClass = 'modal-md';
                        this.columnClass.set(property.property, 'col-sm-12');
                        break;
                    default:
                        this.sizeClass = 'modal-md';
                        this.columnClass.set(property.property, 'col-sm-12');
                        break;
                }
                if (property.dataType == DataType.String &&
                    (<StringEx>property).type == StringType.Html || (<StringEx>property).type == StringType.Json || (<StringEx>property).type == StringType.Address)
                    this.columnClass.set(property.property, 'col-sm-12');

                if (this.columns) {
                    if (this.columns.indexOf(property.property) >= 0)
                        this.properties.push(property)
                } else this.properties.push(property);
            });
        }
        await this.loadItem(item.object as number);
        this.loading = false;
    }
}