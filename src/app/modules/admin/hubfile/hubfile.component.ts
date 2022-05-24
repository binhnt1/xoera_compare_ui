import * as _ from 'lodash';
import { AppInjector } from '../../../app.module';
import { Component, OnInit } from "@angular/core";
import { AdminApiService } from '../../../_core/services/admin.api.service';
import { EditComponent } from '../../../_core/components/edit/edit.component';

@Component({
    templateUrl: './hubfile.component.html',
    styleUrls: ['./hubfile.component.scss'],
})
export class HubFileComponent extends EditComponent implements OnInit {
    loading: boolean = true;
    service: AdminApiService;
    hubFileSummaryId: number;

    constructor() {
        super();
        this.service = AppInjector.get(AdminApiService);
        this.state = this.getUrlState();
    }

    async ngOnInit() {
        this.loading = false;
    }

    selectedChange(id: number) {
        this.hubFileSummaryId = 0;
        setTimeout(() => {
            this.hubFileSummaryId = id;
        }, 500);
    }
}