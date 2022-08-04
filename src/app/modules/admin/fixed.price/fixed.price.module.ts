type AOA = any[][];
import * as XLSX from 'xlsx';
import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { ActionData } from '../../../_core/domains/data/action.data';
import { ActionType } from '../../../_core/domains/enums/action.type';
import { AdminAuthGuard } from '../../../_core/guards/admin.auth.guard';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { NavigationStateData } from '../../../_core/domains/data/navigation.state';
import { FixedPriceEntity } from '../../../_core/domains/entities/fixed.price.entity';
import { EditFixedPriceComponent } from './edit.fixed.price/edit.fixed.price.component';
import { ImportFixedPriceComponent } from './import.fixed.price/import.fixed.price.component';
import { ListImportFixedPriceComponent } from './list.import.fixed.price/list.import.fixed.price.component';

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class FixedPriceComponent extends GridComponent {
    importItems: FixedPriceEntity[] = [];
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        UpdatedBy: false,
        Size: ModalSizeType.Small,
        Reference: FixedPriceEntity,
        Features: [
            ActionData.addNew(() => this.addNew()),
            {
                name: 'Import File',
                icon: 'la la-upload',
                systemName: ActionType.Empty,
                className: 'btn btn-success',
                click: () => {
                    this.fileInput.nativeElement.click();
                }
            }
        ],
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
        let obj: NavigationStateData = {
            prevData: this.itemData,
            prevUrl: '/admin/fixedprice',
        };
        this.router.navigate(['/admin/fixedprice/add'], { state: { params: JSON.stringify(obj) } });
    }

    edit(item: FixedPriceEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevData: this.itemData,
            prevUrl: '/admin/fixedprice',
        };
        this.router.navigate(['/admin/fixedprice/edit'], { state: { params: JSON.stringify(obj) } });
    }

    view(item: FixedPriceEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            viewer: true,
            prevData: this.itemData,
            prevUrl: '/admin/fixedprice',
        };
        this.router.navigate(['/admin/fixedprice/view'], { state: { params: JSON.stringify(obj) } });
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

                let index = 0;
                for (let i = 1; i < excelData.length; i++) {
                    for (let j = 1; j < excelData[i].length; j++) {
                        index += 1;
                        let row: string = excelData[i][0].toString(),
                            column: string = excelData[0][j].toString(),
                            fixedprice: FixedPriceEntity = new FixedPriceEntity();

                        fixedprice.Id = index;
                        fixedprice.Start = row;
                        fixedprice.End = column;
                        fixedprice.Price = Number(excelData[i][j].toString());
                        this.importItems.push(fixedprice);
                    }
                }
                this.loading = false;
                this.dialogService.WapperAsync({
                    cancelText: 'Close',
                    confirmText: 'Import',
                    size: ModalSizeType.Large,
                    title: 'Create Fixed Price',
                    object: ImportFixedPriceComponent,
                    objectExtra: {
                        items: this.importItems
                    },
                }, async () => {
                    await this.loadItems();
                });
                this.fileInput.nativeElement.value = null;
            };
            reader.readAsBinaryString(files[0]);
        }
    }
}

@NgModule({
    declarations: [
        FixedPriceComponent,
        EditFixedPriceComponent,
        ImportFixedPriceComponent,
        ListImportFixedPriceComponent
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: FixedPriceComponent, pathMatch: 'full', data: { state: 'fixedprice' }, canActivate: [AdminAuthGuard] },
            { path: 'add', component: EditFixedPriceComponent, pathMatch: 'full', data: { state: 'add_fixedprice'}, canActivate: [AdminAuthGuard] },
            { path: 'edit', component: EditFixedPriceComponent, pathMatch: 'full', data: { state: 'edit_fixedprice'}, canActivate: [AdminAuthGuard] },
            { path: 'view', component: EditFixedPriceComponent, pathMatch: 'full', data: { state: 'view_fixedprice'}, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class FixedPriceModule { }