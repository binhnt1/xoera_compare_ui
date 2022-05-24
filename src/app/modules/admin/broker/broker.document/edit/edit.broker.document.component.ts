import * as _ from 'lodash';
import { BrokerService } from '../../broker.service';
import { AppInjector } from '../../../../../app.module';
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { validation } from '../../../../../_core/decorators/validator';
import { ResultApi } from '../../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../../_core/helpers/entity.helper';
import { ActionData } from '../../../../../_core/domains/data/action.data';
import { EditorComponent } from '../../../../../_core/editor/editor.component';
import { AgencyEntity } from '../../../../../_core/domains/entities/broker.entity';
import { EditComponent } from '../../../../../_core/components/edit/edit.component';
import { AgencyDocumentEntity } from '../../../../../_core/domains/entities/broker.document.entity';

@Component({
    templateUrl: './edit.broker.document.component.html',
    styleUrls: [
        './edit.broker.document.component.scss',
        '../../../../../../assets/css/modal.scss'
    ],
})
export class EditBrokerDocumentComponent extends EditComponent implements OnInit {
    id: number;
    popup: boolean;
    viewer: boolean;
    brokerId: number;
    @Input() params: any;
    service: BrokerService;
    loading: boolean = true;
    item: AgencyDocumentEntity;
    @ViewChild('uploadFile') uploadFile: EditorComponent;

    constructor() {
        super();
        this.service = AppInjector.get(BrokerService);
    }

    async ngOnInit() {
        this.id = this.getParam('id');
        this.popup = this.getParam('popup');
        this.viewer = this.getParam('viewer');
        this.brokerId = this.getParam('brokerId');
        if (!this.popup) {
            this.addBreadcrumb('Broker Document');
            if (this.viewer)
                this.addBreadcrumb('View');
            else
                this.addBreadcrumb(this.id ? 'Edit' : 'Add');
            this.renderActions();
        }
        await this.loadItem();
        this.loading = false;
    }
    public download() {
        if (this.item && this.item.FileName) {
            let base64String = this.item.DocumentBase64 || this.item.Document;
            let sampleArr = this.base64ToArrayBuffer(base64String);
            this.saveByteArray(this.item.FileName, sampleArr);
        }
    }
    public async confirm(complete: () => void): Promise<boolean> {
        if (this.item) {
            // upload file
            let files = await this.uploadFile.upload();
            let obj: AgencyDocumentEntity = _.cloneDeep(this.item);
            if (files && files.length > 0 && files[0].Name) {
                let file = this.uploadFile.file.items[0];
                obj.FileName = file.Name;
                obj.FileSize = file.Size;
                obj.FileType = file.NativeData.type;
                obj.FileExt = this.getFileExtension(obj.FileName);
                obj.FileLastModifiedAt = file.NativeData.lastModifiedDate;
            }
            obj.DocumentBase64 = files && files.length > 0 && files[0].Base64Data;

            if (await validation(this.item)) {
                return await this.service.addOrUpdateAgencyDocument(obj).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) {
                        let messsage = this.id
                            ? 'Save broker document success'
                            : 'Create broker document success';
                        ToastrHelper.Success(messsage);
                        if (complete) complete();
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
        return false;
    }

    private async loadItem() {
        if (this.id) {
            await this.service.item('AgencyDocument', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(AgencyDocumentEntity, result.Object);
                    this.item.AgencyId = this.brokerId;
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        } else {
            this.item = new AgencyDocumentEntity();
            this.item.AgencyId = this.brokerId;
        }
    }
    private async renderActions() {
        let actions: ActionData[] = [ActionData.back(() => { this.back() })];
        if (!this.viewer) {
            let action = this.id
                ? ActionData.saveUpdate('Save', () => { this.confirmAndBack() })
                : ActionData.saveAddNew('Add new', () => { this.confirmAndBack() });
            actions.push(action);
        }
        this.actions = await this.authen.actionsAllow(AgencyEntity, actions);
    }
    private async confirmAndBack() {
        await this.confirm(() => {
            this.back();
        });
    }
    private getFileExtension(filename: string) {
        return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    }
    private base64ToArrayBuffer(base64: string) {
        let binaryString = window.atob(base64);
        let binaryLen = binaryString.length;
        let bytes = new Uint8Array(binaryLen);
        for (let i = 0; i < binaryLen; i++) {
            let ascii = binaryString.charCodeAt(i);
            bytes[i] = ascii;
        }
        return bytes;
    }
    private saveByteArray(name: string, byte: any) {
        let blob = new Blob([byte]);
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        let fileName = name + ".pdf";
        link.download = fileName;
        console.log(link);
        document.body.appendChild(link)
        link.click();
        document.body.removeChild(link)
    }
}