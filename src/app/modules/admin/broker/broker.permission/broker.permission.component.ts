import * as _ from 'lodash';
import { BrokerService } from '../broker.service';
import { AppInjector } from '../../../../app.module';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { SecurityRightEntity } from '../../../../_core/domains/entities/security.right.entity';

@Component({
    selector: 'broker-permission',
    templateUrl: './broker.permission.component.html',
    styleUrls: ['./broker.permission.component.scss'],
})
export class BrokerPermissionComponent extends EditComponent implements OnInit {
    id: number;
    groups: [];
    service: BrokerService;
    loading: boolean = true;
    items: SecurityRightEntity[];
    
    @Input() brokerId: number;
    @Input() readonly: boolean;
    @Output() choice: EventEmitter<SecurityRightEntity[]> = new EventEmitter();

    constructor() {
        super();
        this.service = AppInjector.get(BrokerService);
    }

    async ngOnInit() {
        await this.loadItem();
        this.loading = false;
    }

    private async loadItem() {
        await this.service.brokerPermissions(this.brokerId).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                this.items = EntityHelper.createEntities(SecurityRightEntity, result.Object);
                if (this.items) {
                    this.items.forEach((item: SecurityRightEntity) => {
                        item.AgencyId = this.brokerId;
                        item.Label = UtilityExHelper.createLabel(item.Label);
                        item.Group = UtilityExHelper.createLabel(item.Group);
                    });
                    this.groups = _(this.items)
                        .groupBy((c: SecurityRightEntity) => c.Group)
                        .map((value: SecurityRightEntity[], key: number) => ({ name: key, items: value }))
                        .value();
                    if (this.groups) {
                        this.groups.sort((a: any, b: any) => a.items.length - b.items.length);
                    }
                }
            } else {
                ToastrHelper.ErrorResult(result);
            }
        });
        this.choice.emit(this.items);
    }

    inputChange(item: SecurityRightEntity) {
        item.Value = !item.Value;
        this.choice.emit(this.items);
    }
}