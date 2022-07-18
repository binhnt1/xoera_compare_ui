declare var $: any
import html2pdf from 'html-to-pdf-js';
import { AppInjector } from "../../../../app.module";
import { Component, Input, OnInit } from "@angular/core";
import { ResultApi } from "../../../../_core/domains/data/result.api";
import { ToastrHelper } from "../../../../_core/helpers/toastr.helper";
import { AdminApiService } from "../../../../_core/services/admin.api.service";
import { FileInvoiceDto } from "../../../../_core/domains/objects/file.invoice.dto";

@Component({
    templateUrl: './file.dispatch.invoice.component.html',
    styleUrls: ['./file.dispatch.invoice.component.scss'],
})
export class FileDispatchInvoiceComponent implements OnInit {
    id: number;
    item: FileInvoiceDto;
    @Input() params: any;
    loading: boolean = true;
    service: AdminApiService;

    constructor() {
        this.service = AppInjector.get(AdminApiService);
    }

    async ngOnInit() {
        this.id = this.params && this.params['invoiceId'];
        await this.loadItem();
        this.loading = false;
    }

    private async loadItem() {
        if (this.id) {
            await this.service.callApi('DispatchInvoice', 'item/' + this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = result.Object;
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
    }
    public async confirm(complete: () => void): Promise<boolean> {
        if (this.item) {
            var element = document.getElementById('dvContainer');
            html2pdf().set({
                margin: [8, 3, 3, 3],
                html2canvas:  { scale: 2 },
                image: { type: 'jpeg', quality: 0.98 },
                filename: 'invoice_' + this.item.Code + '.pdf',
            }).from(element).save();
            if (complete) complete();
        }
        return true;
    }
}