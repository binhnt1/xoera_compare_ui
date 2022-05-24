import { Component, Input, OnInit } from '@angular/core';
import { GridData } from '../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { ActionType } from '../../../../_core/domains/enums/action.type';
import { HubFileTreeComponent } from './hubfile.tree/hubfile.tree.component';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../../_core/components/grid/grid.component';
import { HubFileEntity } from '../../../../_core/domains/entities/hubfile.entity';

@Component({
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class GridHubFileConfirmReportComponent extends GridComponent implements OnInit {
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
            }
        ],
        Features: [],
        MoreActions: [],
        HidePaging: true,
        HideSearch: true,
        LastUpdatedBy: false,
        NotKeepPrevData: true,
        HideCustomFilter: true,
        Title: 'Processed Files',
        Reference: HubFileEntity,
        Size: ModalSizeType.FullScreen,
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Type', Type: DataType.String },
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

        let url = this.router.url;
        if (url.indexOf('/confirmreports') >= 0) {
            this.obj.HidePaging = false;
            this.obj.Title = 'Confirm Report';
            this.obj.Url = '/admin/hubfile/confirmreports';
            this.properties.push({ Property: 'Node13Sent', Title: '#13', Type: DataType.Boolean, Align: 'center' });
        } else if (url.indexOf('/lostsitereports') >= 0) {
            this.obj.HidePaging = false;
            this.obj.Title = 'Lost Site Report';
            this.obj.Url = '/admin/hubfile/lostsitereports';
            this.obj.InlineFilters = ['FilterFromDate', 'FilterToDate'];
            this.properties.push({ Property: 'CreatedAt', Title: 'Created Date', Type: DataType.DateTime, Align: 'center' });
        } else if (url.indexOf('/rejectionreports') >= 0) {
            this.obj.CustomFilters = ['Type', 'Mprn', 'RejectionCode', 'FilterFromDate', 'FilterToDate'];
            this.obj.Url = '/admin/hubfile/rejectionreports';
            this.obj.Title = 'Rejection Report';
            this.obj.HideCustomFilter = false;
            this.obj.DisableAutoLoad = true;
            this.obj.HidePaging = false;
            this.properties = [
                { Property: 'Type', Type: DataType.String },
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
                { Property: 'CreatedAt', Type: DataType.DateTime, Align: 'center' },
                { Property: 'Direction', Type: DataType.String },
                { Property: 'RejectionCode', Type: DataType.String },
                { Property: 'RejectionBy', Type: DataType.String },
            ];
        } else if (url.indexOf('/exceptionreports') >= 0) {
            this.obj.HidePaging = false;
            this.obj.Title = 'Exception Report';
            this.obj.Url = '/admin/hubfile/exceptionreports';
            this.obj.InlineFilters = ['FilterFromDate', 'FilterToDate'];
            this.properties.push({ Property: 'ErrorDetail', Type: DataType.String });
            this.properties.push({ Property: 'ValidationResult', Type: DataType.String });
        } else if (url.indexOf('/allrejectionreports') >= 0) {
            this.obj.CustomFilters = ['Type', 'Mprn', 'RejectionCode', 'FilterFromDate', 'FilterToDate'];
            this.obj.Url = '/admin/hubfile/allrejectionreports';
            this.obj.Title = 'All Rejection Report';
            this.obj.HideCustomFilter = false;
            this.obj.DisableAutoLoad = true;
            this.obj.HidePaging = false;
            this.properties = [
                { Property: 'CreatedAt', Title: 'Date', Type: DataType.DateTime, Align: 'center' },
                {
                    Property: 'Mprn', Type: DataType.String,
                    Format: (item: any) => {
                        let text = '';
                        if (item.Mprn) text += '<p>' + item.Mprn + '</p>';
                        if (item.NomShipperRef) text += '<p>NomShipperRef: ' + item.NomShipperRef + '</p>';
                        return text;
                    }
                },
                { Property: 'Type', Type: DataType.String },
                {
                    Property: 'FileName', Type: DataType.String,
                    Format: (item: any) => {
                        let text = '<p>' + item.FileName + '</p>';
                        if (item.FileExt) text += '<p>File Ext: ' + item.FileExt + '</p>';
                        return text;
                    }
                },
                { Property: 'Direction', Type: DataType.String },
                { Property: 'RejectionCode', Type: DataType.String },
                { Property: 'RejectionBy', Type: DataType.String },
            ];
        } else if (url.indexOf('/dailyobjectinonreports') >= 0) {
            this.obj.HidePaging = false;
            this.obj.InlineFilters = ['FilterDate'];
            this.obj.Title = 'Daily Objectinon Report';
            this.obj.Url = '/admin/hubfile/dailyobjectinonreports';
            this.properties.push({ Property: 'CreatedAt', Title: 'Created Date', Type: DataType.DateTime, Align: 'center' });
        } else if (url.indexOf('/dailygainedsitereports') >= 0) {
            this.obj.HidePaging = false;
            this.obj.InlineFilters = ['FilterDate'];
            this.obj.Title = 'Daily Gained Site Report';
            this.obj.Url = '/admin/hubfile/dailygainedsitereports';
            this.properties.push({ Property: 'CreatedAt', Title: 'Created Date', Type: DataType.DateTime, Align: 'center' });
        } else if (url.indexOf('/lostnotificationreports') >= 0) {
            this.obj.HidePaging = false;
            this.obj.Title = 'Lost Notification Report';
            this.obj.Url = '/admin/hubfile/lostnotificationreports';
            this.obj.InlineFilters = ['FilterFromDate', 'FilterToDate'];
            this.properties.push({ Property: 'Node79Sent', Title: '#79', Type: DataType.Boolean, Align: 'center' });
        } else if (url.indexOf('/dailyconfirmationreports') >= 0) {
            this.obj.HidePaging = false;
            this.obj.InlineFilters = ['FilterDate'];
            this.obj.Title = 'Daily Confirmation Report';
            this.obj.Url = '/admin/hubfile/dailyconfirmationreports';
            this.properties.push({ Property: 'CreatedAt', Title: 'Created Date', Type: DataType.DateTime, Align: 'center' });
        }
    }

    ngOnInit() {
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