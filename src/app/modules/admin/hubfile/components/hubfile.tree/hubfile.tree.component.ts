import { HubFileService } from '../../hubfile.service';
import { AppInjector } from '../../../../../app.module';
import { Component, Input, OnInit } from '@angular/core';
import { ResultApi } from '../../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../../_core/helpers/toastr.helper';
import { HubFileFlow } from '../../../../../_core/domains/entities/hubfile.entity';

@Component({
    selector: 'hubfile-tree',
    templateUrl: './hubfile.tree.component.html',
    styleUrls: ['././hubfile.tree.component.scss'],
})
export class HubFileTreeComponent implements OnInit {
    data: string;
    item: HubFileFlow;
    @Input() params: any;
    loading: boolean = true;
    service: HubFileService;

    constructor() {
        this.service = AppInjector.get(HubFileService);
    }

    ngOnInit() {
        this.loadHubFileTree();
    }

    loadHubFileTree() {
        let id = this.params && this.params['id'],
            content = this.params && this.params['content'];
        if (id) {
            this.service.loadHubFileTree(id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result) && result.Object) {
                    this.item = result.Object.Root;
                    this.data = result.Object.RawData;
                } else ToastrHelper.ErrorResult(result);
                this.loading = false;
            });
        } else if (content) {
            this.service.loadHubFileTreeContent(content).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result) && result.Object) {
                    this.item = result.Object.Root;
                    this.data = result.Object.RawData;
                } else {
                    this.data = result.Object;
                    ToastrHelper.ErrorResult(result);
                }
                this.loading = false;
            });
        }
    }
}