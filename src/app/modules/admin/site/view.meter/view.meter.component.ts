import { Component, Input, OnInit } from "@angular/core";
import { ResultApi } from "../../../../_core/domains/data/result.api";
import { EntityHelper } from "../../../../_core/helpers/entity.helper";
import { MeterEntity } from "../../../../_core/domains/entities/meter.entity";
import { AdminApiService } from "../../../../_core/services/admin.api.service";

@Component({
    selector: 'view-meter',
    templateUrl: './view.meter.component.html',
    styleUrls: ['./view.meter.component.scss'],
})
export class ViewMeterComponent implements OnInit {
    tab: string;
    item: MeterEntity;
    @Input() id: number;
    loading: boolean = true;

    constructor(public service: AdminApiService) {
    }

    ngOnInit() {
        this.loadItem();
    }

    selectedTab(tab: string) {
        this.tab = tab;
    }

    loadItem() {
        if (this.id) {
            this.service.item('meter', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MeterEntity, result.Object);
                }
                this.loading = false;
            });
        }
    }
}