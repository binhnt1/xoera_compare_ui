import * as _ from "lodash";
import { AppConfig } from "../../helpers/app.config";
import { ApiUrl } from "../../helpers/api.url.helper";
import { FileData } from "../../domains/data/file.data";
import { FileType } from "../../domains/enums/file.type";
import { ResultApi } from "../../domains/data/result.api";
import { StoreType } from "../../domains/enums/data.type";
import { ImageEx } from "../../decorators/image.decorator";
import { ToastrHelper } from "../../helpers/toastr.helper";
import { UploadData } from "../../domains/data/upload.data";
import { ValidatorHelper } from "../../helpers/validator.helper";
import { AdminApiService } from "../../services/admin.api.service";
import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";

@Component({
    selector: 'editor-upload-image',
    styleUrls: ['./upload.image.component.scss'],
    templateUrl: './upload.image.component.html',
})
export class UploadImageComponent implements OnInit {
    StoreType = StoreType;
    removedFile: FileData;
    items: FileData[] = [];

    @Input() value: any;
    @Input() decorator: ImageEx;
    @ViewChild('fileInput') fileInput: ElementRef;

    constructor(public service: AdminApiService) {
    }

    ngOnInit() {
        this.renderImage();
    }

    public renderImage() {
        this.items = [];
        if (this.value) {
            if (this.decorator.store == StoreType.Database) {
                if (this.value) {
                    let items: string[];
                    if (this.decorator.multiple) {
                        items = Array.isArray(this.value)
                            ? this.value as string[]
                            : JSON.parse(this.value);
                    } else {
                        items = Array.isArray(this.value)
                            ? this.value as string[]
                            : [this.value];
                    }
                    if (items && items.length > 0) {
                        items.forEach((item: string) => {
                            let data = item.indexOf('data:image') < 0
                                ? 'data:image/png;base64,' + item
                                : item;
                            let size = item.lastIndexOf('==')
                                ? item.length * 3 / 4 - 2
                                : item.length * 3 / 4 - 1;
                            this.items.push({
                                Size: size,
                                Data: data,
                                Base64Data: data,
                            });
                        });
                    }
                }
            } else {
                let items: string[];
                if (this.decorator.multiple) {
                    items = Array.isArray(this.value)
                        ? this.value as string[]
                        : JSON.parse(this.value);
                } else {
                    items = Array.isArray(this.value)
                        ? this.value as string[]
                        : [this.value];
                }
                if (items && items.length > 0) {
                    items.forEach((value: string) => {
                        if (value.indexOf('http') >= 0) {
                            this.items.push({
                                Path: value,
                                Name: value.substring(this.value.lastIndexOf('/') + 1).substring(this.value.lastIndexOf('\\') + 1)
                            });
                        } else {
                            if (value.indexOf('data:image/') >= 0) {
                                this.items.push({
                                    Data: value,
                                    Name: value.substring(this.value.lastIndexOf('/') + 1).substring(this.value.lastIndexOf('\\') + 1)
                                });
                            } else {
                                this.items.push({
                                    Path: AppConfig.ApiUrl + '/' + value,
                                    Name: value.substring(this.value.lastIndexOf('/') + 1).substring(this.value.lastIndexOf('\\') + 1)
                                });
                            }
                        }
                    });
                }
            }
        }
    }
    public readFile(files: any) {
        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                let item: FileData = {
                    Path: null,
                    Percent: 0,
                    Name: file.name,
                    NativeData: file,
                    Size: file.size / 1024 / 1024,
                };

                let FR = new FileReader();
                FR.onload = () => {
                    item.Data = FR.result;
                    var decoder = new TextDecoder('utf8');
                    item.ByteData = new Uint8Array(item.Data);
                    item.Base64Data = btoa(decoder.decode(item.ByteData));
                    if (this.removedFile) {
                        let index = this.items.findIndex(c => c.Name == this.removedFile.Name);
                        if (index >= 0) this.items[index] = item;
                        this.removedFile = null;
                    } else this.items.push(item);
                    this.value = item.Data;
                };
                FR.onerror = () => {
                    ToastrHelper.Error('Image ' + file.name + ' error, please choose another image');
                };
                FR.readAsDataURL(file);
            }
        }
    }
    public selectedFile(event: any) {
        let files = event.srcElement.files;
        if (files && files.length > 0) {
            if (!ValidatorHelper.validImageUpload(files)) {
                ToastrHelper.Error('Images incorrect format');
            } else {
                this.readFile(files);
            }
        }
    }
    public removeFile(item: FileData) {
        if (!this.decorator.multiple) this.items = [];
        else _.remove(this.items, (c: FileData) => c.Name == item.Name);
    }
    public async upload(): Promise<FileData[]> {
        if (this.items && this.items.length > 0) {
            if (this.decorator.store == StoreType.Database) {
                this.items.forEach((item: FileData) => {
                    item.Percent = 100;
                    item.Success = true;
                    if (!item.Base64Data) {
                        item.Base64Data = item.Data.indexOf(',') >= 0
                            ? item.Data.split(',')[1]
                            : item.Data;
                    } else {
                        item.Base64Data = item.Base64Data.indexOf(',') >= 0
                            ? item.Data.split(',')[1]
                            : item.Data;
                    }
                    if (!item.ByteData)
                        item.ByteData = Uint8Array.from(atob(item.Base64Data), c => c.charCodeAt(0));
                });
            } else {
                let api = ApiUrl.ToUrl('/admin/' + this.decorator.url);
                this.items.forEach(async (item: FileData) => {
                    let obj: UploadData = {
                        type: FileType.Image,
                        data: item.NativeData,
                        processFunction: (percent: number) => {
                            item.Percent = percent;
                        },
                        completeFunction: (result: ResultApi) => {
                            item.Percent = 100;
                            item.Success = ResultApi.IsSuccess(result);
                            if (item.Success)
                                item.Path = result.Object as string;
                        }
                    }
                    await this.service.upload(api, obj);
                });
            }
        }
        return this.items;
    }
    public selectFileToUpload(item?: FileData) {
        this.removedFile = item;
        this.fileInput.nativeElement.click();
    }
}