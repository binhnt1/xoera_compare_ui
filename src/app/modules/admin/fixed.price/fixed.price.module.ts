type AOA = any[][];
import * as XLSX from 'xlsx';
import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { ActionType } from '../../../_core/domains/enums/action.type';
import { AdminAuthGuard } from '../../../_core/guards/admin.auth.guard';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { FixedPriceEntity } from '../../../_core/domains/entities/fixed.price.entity';
import { EditFixedPriceComponent } from './edit.fixed.price/edit.fixed.price.component';

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class FixedPriceComponent extends GridComponent {
    importItems: any[];
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        UpdatedBy: false,
        Size: ModalSizeType.Small,
        Reference: FixedPriceEntity,
        Features: [{
            name: 'Import File',
            icon: 'la la-upload',
            systemName: ActionType.Empty,
            className: 'btn btn-success',
            click: () => {
                this.fileInput.nativeElement.click();
            }
        }],
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            { Property: 'Tariff', Type: DataType.String },
            { Property: 'Vehicle', Type: DataType.String },
            { Property: 'Price', Type: DataType.Number },
            { Property: 'Drop', Type: DataType.Number },
            { Property: 'Return', Type: DataType.Number },
            { Property: 'ReverseDirection', Type: DataType.Boolean },
            { Property: 'Start', Type: DataType.String },
            { Property: 'End', Type: DataType.String },
        ];
        if (this.authen.management) {
            this.properties.splice(1, 0, { Property: 'Account', Type: DataType.String });
        }
        this.render(this.obj);
    }

    addNew() {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            confirmText: 'Create',
            title: 'Create Fixed Price',
            size: ModalSizeType.Large,
            object: EditFixedPriceComponent,
        }, async () => {
            await this.loadItems();
        });
    }

    edit(item: FixedPriceEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            confirmText: 'Save',
            title: 'Edit Fixed Price',
            size: ModalSizeType.Large,
            object: EditFixedPriceComponent,
            objectExtra: {
                id: item.Id,
            }
        }, async () => {
            await this.loadItems();
        });
    }

    view(item: FixedPriceEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            title: 'View Fixed Price',
            size: ModalSizeType.Large,
            object: EditFixedPriceComponent,
            objectExtra: {
                id: item.Id,
                viewer: true,
            }
        });
    }

    public readFile(files: any[]): void {
        /* wire up file reader */
        if (files && files.length > 0) {
            this.loading = true;
            let reader = new FileReader();
            if (files.length == 0)
                return;
            reader.onload = (e: any) => {
                /* read workbook */
                const bstr: string = e.target.result;

                const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

                /* grab first sheet */
                const wsname: string = wb.SheetNames[0];
                const ws: XLSX.WorkSheet = wb.Sheets[wsname];

                /* save data */
                let excelData = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
                if (wb.SheetNames.length > 1) {
                    let numb = wsname.replace(/[^0-9\.]+/g, "");
                    if (numb.length > 0 && wsname.substr(0, 5) != "Sheet") {
                        if (typeof excelData[0] === "object") {
                            excelData[0][excelData[0].length] = "Uplift";
                        }
                        for (let j = 1; j < excelData.length; j++) {
                            if (typeof excelData[j] === "object") {
                                excelData[j][excelData[0].length - 1] = numb;
                            }
                        }
                    }
                }

                for (let i = 1; i < wb.SheetNames.length; ++i) {
                    const sheet: XLSX.WorkSheet = wb.Sheets[wb.SheetNames[i]];
                    let sheetName = wb.SheetNames[i];
                    let numb2 = sheetName.replace(/[^0-9\.]+/g, "");
                    if (numb2.length > 0 && sheetName.substr(0, 5) != "Sheet") {
                        let data = <AOA>(XLSX.utils.sheet_to_json(sheet, { header: 1, range: 1 }));
                        for (let j = 0; j < data.length; j++) {
                            if (typeof data[j] === "object") {
                                data[j][excelData[0].length - 1] = numb2;
                            }
                        }
                        excelData = excelData.concat(data);
                    }
                }
                let items: any[] = [];
                for (let i = 1; i < excelData.length; i++) {
                    let item: any = {};
                    for (let j = 0; j < excelData[i].length; j++) {
                        let column: string = excelData[0][j].toString();
                        switch (column.toUpperCase().trim()) {
                            case 'TW6': item.tw6 = excelData[i][j]; break;
                            case 'RH6': item.rh6 = excelData[i][j]; break;
                            case 'LU2': item.lu2 = excelData[i][j]; break;
                            case 'E16': item.e16 = excelData[i][j]; break;
                            case 'SS2': item.ss2 = excelData[i][j]; break;
                            case 'CM24': item.cm24 = excelData[i][j]; break;
                            case 'PICKUP': item.pickup = excelData[i][j]; break;
                        }
                    }
                    item.Id = i;
                    items.push(item);
                }
                this.importItems = items;
                this.loading = false;
            };
            reader.readAsBinaryString(files[0]);
        }
    }
}

@NgModule({
    declarations: [FixedPriceComponent, EditFixedPriceComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: FixedPriceComponent, pathMatch: 'full', data: { state: 'fixedprice' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class FixedPriceModule { }