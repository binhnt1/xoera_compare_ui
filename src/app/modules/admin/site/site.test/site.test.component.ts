import { Component } from "@angular/core";
import { GridData } from "../../../../_core/domains/data/grid.data";
import { FileData } from "../../../../_core/domains/data/file.data";
import { DataType } from "../../../../_core/domains/enums/data.type";
import { ToastrHelper } from "../../../../_core/helpers/toastr.helper";
import { ActionData } from "../../../../_core/domains/data/action.data";
import { ActionType } from "../../../../_core/domains/enums/action.type";
import { SiteEntity } from "../../../../_core/domains/entities/site.entity";
import { ModalSizeType } from "../../../../_core/domains/enums/modal.size.type";
import { GridComponent } from "../../../../_core/components/grid/grid.component";
import { NavigationStateData } from "../../../../_core/domains/data/navigation.state";
import { HubFileTreeComponent } from "../../hubfile/components/hubfile.tree/hubfile.tree.component";

@Component({
    templateUrl: '../../../../_core/components/grid/grid.component.html',
})
export class SiteTestComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        Features: [
            {
                icon: 'la la-upload',
                name: 'Incoming File',
                systemName: ActionType.Empty,
                className: 'btn btn-success',
                click: () => {
                    this.fileInput.nativeElement.click();
                }
            },
            ActionData.reload(() => this.loadItems())
        ],
        Actions: [
            {
                icon: 'la la-eye',
                name: 'View Test',
                systemName: ActionType.View,
                className: 'btn btn-warning',
                click: (item: any) => {
                    this.view(item);
                }
            }
        ],
        LastUpdatedBy: false,
        Reference: SiteEntity,
        Size: ModalSizeType.Large,
        Title: 'Flow Content Test'
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            { Property: 'Type', Type: DataType.String },
            {
                Property: 'SiteRef', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '<p>' + item.BillingStreet + '</p>';
                    if (item.SiteName) text += '<p>Site Name: ' + item.SiteName + '</p>';
                    if (item.Postcode) text += '<p>Postcode: ' + item.Postcode + '</p>';
                    return text;
                })
            },
            {
                Property: 'BillingStreet', Type: DataType.String,
                Format: ((item: any) => {
                    let text = '<p>' + item.BillingStreet + '</p>';
                    if (item.BillingPostcode)
                        text += '<p>Postcode: ' + item.BillingPostcode + '</p>';
                    return text;
                })
            },
            { Property: 'AccountNumber', Type: DataType.String },
            { Property: 'AccountStatus', Type: DataType.String },
            { Property: 'PrincipalStreet', Type: DataType.String },
            { Property: 'Mpr', Type: DataType.String },
            { Property: 'Status', Type: DataType.String },
            { Property: 'PaymentType', Type: DataType.String },
            { Property: 'Customer', Type: DataType.String },
        ];
        this.render(this.obj);
    }

    view(item: SiteEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            viewer: true,
            prevData: this.itemData,
            prevUrl: '/admin/site/test',
        };
        this.router.navigateByUrl('/admin/site/view?save=false', { state: { params: JSON.stringify(obj) } });
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
                    if (item.Data) {
                        this.dialogService.WapperAsync({
                            cancelText: 'Close',
                            title: 'View hierarchy',
                            size: ModalSizeType.Large,
                            object: HubFileTreeComponent,
                            objectExtra: { content: item.Data },
                        });
                    }
                };
                FR.onerror = () => {
                    ToastrHelper.Error('File ' + file.name + ' error, please choose another file');
                };
                FR.readAsText(file);
            }
        }
    }
}