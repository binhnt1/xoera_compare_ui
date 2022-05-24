import { SiteService } from '../site.service';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from '@angular/core';
import { GridData } from '../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { ActionType } from '../../../../_core/domains/enums/action.type';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../../_core/components/grid/grid.component';
import { HubFileEntity } from '../../../../_core/domains/entities/hubfile.entity';
import { AdminDialogService } from '../../../../_core/services/admin.dialog.service';
import { HubFileTreeComponent } from '../../hubfile/components/hubfile.tree/hubfile.tree.component';

@Component({
    selector: 'list-hub-file',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class ListHubFileComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Features: [
            ActionData.reload(() => this.loadItems())
        ],
        Actions: [
            {
                icon: 'la la-eye',
                name: ActionType.View,
                systemName: ActionType.View,
                className: 'btn btn-warning',
                click: (item: any) => {
                    this.view(item);
                }
            },
            // ActionData.delete((item: any) => this.delete(item.Id)),
            // {
            //     icon: 'la la-upload',
            //     name: ActionType.View,
            //     systemName: ActionType.View,
            //     className: 'btn btn-success',
            //     click: (item: any) => {
            //         this.upload(item);
            //     }
            // },
            {
                name: 'Re-try',
                icon: 'la la-bolt',
                className: 'btn btn-primary',
                hidden: (item: any) => {
                    return item.ErrorDetail == null || item.ErrorDetail.length == 0;
                },
                click: (item: any) => {
                    this.dialog.ConfirmAsync('Do you want re-try file?', async () => {
                        await this.siteService.reTry(item.Id).then((result: ResultApi) => {
                            if (ResultApi.IsSuccess(result)) {
                                ToastrHelper.Success("Re-try file processing...");
                                this.loadItems();
                            } else {
                                ToastrHelper.ErrorResult(result);
                                return false;
                            }
                        });
                    })
                },
                systemName: this.ActionType.Verify,
            }
        ],
        HideSearch: true,
        HidePaging: true,
        LastUpdatedBy: false,
        HideHeadActions: true,
        Reference: HubFileEntity,
    };
    @Input() siteId: number;

    siteService: SiteService;
    dialog: AdminDialogService;

    constructor() {
        super();
        this.siteService = AppInjector.get(SiteService);
        this.dialog = AppInjector.get(AdminDialogService);
        this.properties = [
            { Property: 'Mprn', Type: DataType.String },
            { Property: 'Type', Type: DataType.String },
            { Property: 'L1Record', Type: DataType.String },
            { Property: 'Direction', Type: DataType.String },
            { Property: 'FileName', Type: DataType.String },
            {
                Property: 'Sender', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '<p>' + item.Sender + '</p>';
                    if (item.SenderRole) text += '<p>Role: ' + item.SenderRole + '</p>';
                    return text;
                })
            },
            {
                Property: 'Recipient', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '<p>' + item.Recipient + '</p>';
                    if (item.RecipientRole) text += '<p>Role: ' + item.RecipientRole + '</p>';
                    return text;
                })
            },
            { Property: 'ErrorDetail', Type: DataType.String },
            { Property: 'CreatedAt', Type: DataType.DateTime },
            { Property: 'Description', Type: DataType.String },
            {
                Property: 'NomShipperRef', Title: 'Unique Ref', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '';
                    if (item.NomShipperRef) text += '<p class="d-flex justify-content-between"><span>NomShipperRef: </span><span>' + item.NomShipperRef + '</span></p>';
                    if (item.FileNameReference) text += '<p class="d-flex justify-content-between"><span>FileNameRef: </span><span>' + item.FileNameReference + '</span></p>';
                    if (item.MeterPointReference) text += '<p class="d-flex justify-content-between"><span>MeterPointRef: </span><span>' + item.MeterPointReference + '</span></p>';
                    if (item.TransactionReference) text += '<p class="d-flex justify-content-between"><span>TransactionRef: </span><span>' + item.TransactionReference + '</span></p>';
                    if (item.ConfirmationReference) text += '<p class="d-flex justify-content-between"><span>ConfirmationRef: </span><span>' + item.ConfirmationReference + '</span></p>';
                    if (item.SupplyPointConfirmationReference) text += '<p class="d-flex justify-content-between"><span>SupplyPointRef: </span><span>' + item.SupplyPointConfirmationReference + '</span></p>';
                    return text;
                })
            },
            {
                Property: 'AccountNumber', Title: 'Ftp', Type: DataType.String, Align: 'center',
                Format: (item: any) => {
                    if (item.Direction == 'IN') return '';
                    return item.ErrorDetail != "Can't upload file to ftp" 
                        ? '<i class="fa fa-check"></i>'
                        : '<i class="fa fa-warning"></i>';
                }
            },
        ];
    }

    ngOnInit() {
        this.obj.Url = '/Admin/HubFile/Items?siteId=' + this.siteId;
        this.render(this.obj);
    }

    view(item: any) {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            title: 'View hierarchy',
            size: ModalSizeType.Large,
            objectExtra: { id: item.Id },
            object: HubFileTreeComponent,
        });
    }

    upload(item: any) {
        this.loading = true;
        this.siteService.uploadHubFile(item.Id).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                let upload = result.Object as boolean;
                if (upload) ToastrHelper.Success('Upload success');
                else ToastrHelper.Error('Upload error');
            } else ToastrHelper.ErrorResult(result);
            this.loading = false;
        });
    }
}