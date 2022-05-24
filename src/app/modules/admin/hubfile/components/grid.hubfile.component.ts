import { AppInjector } from '../../../../app.module';
import { SiteService } from '../../site/site.service';
import { Component, Input, OnInit } from '@angular/core';
import { GridData } from '../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { ActionType } from '../../../../_core/domains/enums/action.type';
import { HubFileTreeComponent } from './hubfile.tree/hubfile.tree.component';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../../_core/components/grid/grid.component';
import { HubFileEntity } from '../../../../_core/domains/entities/hubfile.entity';

@Component({
    selector: 'grid-hubfile',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class GridHubFileComponent extends GridComponent implements OnInit {
    @Input() params: any;
    obj: GridData = {
        Exports: [],
        Filters: [],
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
            {
                name: 'Re-try',
                icon: 'la la-bolt',
                className: 'btn btn-primary',
                hidden: (item: any) => {
                    return item.ErrorDetail == null || item.ErrorDetail.length == 0;
                },
                click: (item: any) => {
                    this.dialogService.ConfirmAsync('Do you want re-try file?', async () => {
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
        Features: [],
        MoreActions: [],
        HidePaging: true,
        HideSearch: true,
        LastUpdatedBy: false,
        HideCustomFilter: true,
        Title: 'Processed Files',
        Reference: HubFileEntity,
        Size: ModalSizeType.FullScreen,
    };
    siteService: SiteService;

    constructor() {
        super();
        this.siteService = AppInjector.get(SiteService);
        this.properties = [
            { Property: 'Type', Type: DataType.String },
            { Property: 'SiteId', Type: DataType.String },
            {
                Property: 'FileName', Type: DataType.String,
                Format: (item: any) => {
                    let text = '<p>' + item.FileName + '</p>';
                    if (item.FileExt) text += '<p>File Ext: ' + item.FileExt + '</p>';
                    return text;
                }
            },
            {
                Property: 'Mprn', Type: DataType.String,
                Format: (item: any) => {
                    let text = '';
                    if (item.Mprn) text += '<p>' + item.Mprn + '</p>';
                    if (item.NomShipperRef) text += '<p>NomShipperRef: ' + item.NomShipperRef + '</p>';
                    return text;
                }
            },
            {
                Property: 'Sender', Type: DataType.String,
                Format: (item: any) => {
                    let text = '<p>' + item.Sender + '</p>';
                    if (item.SenderRole) text += '<p>Sender Role: ' + item.SenderRole + '</p>';
                    return text;
                }
            },
            {
                Property: 'Recipient', Type: DataType.String,
                Format: (item: any) => {
                    let text = '<p>' + item.Recipient + '</p>';
                    if (item.RecipientRole) text += '<p>Recipient Role: ' + item.RecipientRole + '</p>';
                    return text;
                }
            },
            { Property: 'L1Record', Type: DataType.String },
            { Property: 'CreatedAt', Type: DataType.DateTime, Align: 'center' },
            { Property: 'Direction', Type: DataType.String },
            { Property: 'ValidationResult', Type: DataType.String },
            { Property: 'ErrorDetail', Type: DataType.String },
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
        let id = this.params && this.params['id'];
        this.obj.Url = '/admin/HubFile/Items/' + id;
        this.itemData = {
            Paging: {
                Index: 1,
                Size: 100,
            }
        };
        this.render(this.obj);
    }

    retry(item: any) {
        this.dialogService.Alert('Message', 'Update later');
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
}