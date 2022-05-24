import { SiteService } from "../site.service";
import { ResultApi } from "../../../../_core/domains/data/result.api";
import { EntityHelper } from "../../../../_core/helpers/entity.helper";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MeterPointEntity } from "../../../../_core/domains/entities/meter.point.entity";

@Component({
    selector: 'view-meter-point',
    templateUrl: './view.meter.point.component.html',
    styleUrls: ['./view.meter.point.component.scss'],
})
export class ViewMeterPointComponent implements OnInit {
    tab: string;
    item: MeterPointEntity;
    @Input() siteId: number;
    loading: boolean = true;
    @Output() loaded: EventEmitter<MeterPointEntity> = new EventEmitter<MeterPointEntity>();

    constructor(public service: SiteService) {
    }

    ngOnInit() {
        this.loadItem();
    }

    loadItem() {
        if (this.siteId) {
            this.service.loadMeterPoint(this.siteId).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(MeterPointEntity, result.Object);
                    console.log(this.item.SupplyStartDate);
                    this.loaded.emit(this.item);
                }
                this.loading = false;
            });
        }
    }

    selectedTab(tab: string) {
        this.tab = tab;
    }
}