import { Component, Input, OnInit } from "@angular/core";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { ActionData } from "../../../../_core/domains/data/action.data";
import { ActionType } from "../../../../_core/domains/enums/action.type";
import { BaseEntity } from "../../../../_core/domains/entities/base.entity";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { AgencyDocumentEntity } from "../../../../_core/domains/entities/broker.document.entity";

@Component({
    selector: 'list-broker-document',
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class BrokerDocumentComponent extends GridComponent implements OnInit {
    obj: GridData = {
        Filters: [],
        Imports: [],
        Exports: [],
        Features: [
            ActionData.addNew(() => this.addNew()),
            ActionData.reload(() => this.loadItems())
        ],
        IsPopup: true,
        LastUpdatedBy: false,
        HideCustomFilter: true,
        Reference: AgencyDocumentEntity,
    };
    @Input() brokerId: number;
    @Input() readonly: boolean;

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            { Property: 'DocumentName', Type: DataType.String },
            { Property: 'FileName', Type: DataType.String },
            { Property: 'FileSize', Type: DataType.String },
            { Property: 'FileType', Type: DataType.String },
        ];
    }

    addNew(): void {
        let obj = {
            tab: 'document',
            readonly: this.readonly,
            brokerId: this.brokerId,
            prevUrl: '/admin/broker/edit',
        };
        this.router.navigate(['/admin/broker/brokerdocument/add'], { state: { params: JSON.stringify(obj) } });
    }

    edit(item: BaseEntity): void {
        let obj = {
            id: item.Id,
            tab: 'document',
            readonly: this.readonly,
            brokerId: this.brokerId,
            prevUrl: '/admin/broker/edit',
        };
        this.router.navigate(['/admin/broker/brokerdocument/edit'], { state: { params: JSON.stringify(obj) } });
    }

    view(item: BaseEntity): void {
        let obj = {
            id: item.Id,
            viewer: true,
            tab: 'document',
            readonly: this.readonly,
            brokerId: this.brokerId,
            prevUrl: '/admin/broker/edit',
        };
        this.router.navigate(['/admin/broker/brokerdocument/view'], { state: { params: JSON.stringify(obj) } });
    }

    async ngOnInit() {
        this.obj.Url = '/Admin/AgencyDocument/Items/' + this.brokerId;
        let actionDownload = {
            icon: 'la la-download',
            name: ActionType.Download,
            systemName: ActionType.Empty,
            className: 'btn btn-success',
            click: (item: any) => {
                if (item && item.FileName) {
                    this.loading = true;
                    let base64String = item.DocumentBase64 || item.Document;
                    let sampleArr = this.base64ToArrayBuffer(base64String);
                    this.saveByteArray(item.FileName, sampleArr);
                    this.loading = false;
                }
            }
        };
        if (this.readonly) {
            this.obj.Features = [ActionData.reload(() => this.loadItems())];
            this.obj.Actions = [ActionData.view((item: any) => this.view(item)), actionDownload];
        } else {
            this.obj.Actions = [
                ActionData.edit((item: any) => this.edit(item)),
                ActionData.view((item: any) => this.view(item)),
                ActionData.delete((item: any) => this.delete(item)),
                actionDownload
            ];

        }
        await this.render(this.obj);
        this.obj.Title = '';
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