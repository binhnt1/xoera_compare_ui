import { HubFileService } from '../hubfile.service';
import { AppInjector } from '../../../../app.module';
import { Component, EventEmitter, Output } from '@angular/core';
import { GridData } from '../../../../_core/domains/data/grid.data';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { ActionType } from '../../../../_core/domains/enums/action.type';
import { UploadFileComponent } from './upload.file/upload.file.component';
import { CompareType } from '../../../../_core/domains/enums/compare.type';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../../_core/components/grid/grid.component';
import { HubFileSummaryEntity } from '../../../../_core/domains/entities/hubfile.summary.entity';

@Component({
    selector: 'grid-hubfile-summary',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class GridHubFileSummaryComponent extends GridComponent {
    obj: GridData = {
        Exports: [],
        Filters: [],
        Actions: [
            {
                icon: 'la la-eye',
                name: ActionType.View,
                systemName: ActionType.View,
                className: 'btn btn-warning',
                hidden: (item: any) => {
                    return item.FileCount == 0;
                },
                click: (item: any) => {
                    this.view(item);
                }
            }
        ],
        Features: [
            ActionData.reload(() => this.loadItems()),
            {
                name: 'Run now',
                icon: 'la la-bolt',
                systemName: ActionType.Empty,
                className: 'btn btn-warning',
                click: async () => {
                    this.loading = true;
                    await this.service.runNow();
                    this.loadItems();
                }
            },
            {
                name: 'Upload File',
                icon: 'la la-upload',
                className: 'btn btn-info',
                systemName: ActionType.Empty,
                click: async () => {
                    this.dialogService.WapperAsync({
                        cancelText: 'Close',
                        confirmText: 'Upload',
                        title: 'Upload files',
                        size: ModalSizeType.Medium,
                        object: UploadFileComponent,
                    });
                }
            }
        ],
        MoreActions: [],
        HideSearch: true,
        LastUpdatedBy: false,
        Title: 'Hub Transactions',
        Size: ModalSizeType.FullScreen,
        Reference: HubFileSummaryEntity,
        CustomFilters: ['DateTime',
            {
                Name: 'FileCount',
                Type: CompareType.N_GreaterThanOrEqual
            }, {
                Name: 'ErrorCount',
                Type: CompareType.N_GreaterThanOrEqual
            }, {
                Name: 'SuccessCount',
                Type: CompareType.N_GreaterThanOrEqual
            }
        ],
    };
    service: HubFileService;
    @Output() selectedChange = new EventEmitter<number>();

    constructor() {
        super();
        this.itemData = {
            Paging: {
                Index: 1,
                Size: 10,
            }
        };
        this.properties = [
            { Property: 'Time', Type: DataType.Number, Align: 'right' },
            { Property: 'DateTime', Type: DataType.DateTime, Align: 'center' },
            { Property: 'FileName', Title: 'File Name', Type: DataType.String },
            { Property: 'FileCount', Title: 'File Count', Type: DataType.Number, Align: 'right' },
            { Property: 'ErrorCount', Title: 'Error Count', Type: DataType.Number, Align: 'right' },
            { Property: 'SuccessCount', Title: 'Success Count', Type: DataType.Number, Align: 'right' },
        ];
        this.render(this.obj);
        this.service = AppInjector.get(HubFileService);
    }

    view(item: any) {
        this.rowSelected = item.Id;
        this.selectedChange.emit(item.Id);
    }
}