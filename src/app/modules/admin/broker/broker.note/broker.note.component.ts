import * as _ from 'lodash';
import { BrokerService } from '../broker.service';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from '@angular/core';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { AgencyNoteEntity } from '../../../../_core/domains/entities/broker.note.entity';

@Component({
    selector: 'broker-note',
    templateUrl: './broker.note.component.html',
    styleUrls: ['./broker.note.component.scss']
})
export class BrokerNoteComponent extends EditComponent implements OnInit {
    service: BrokerService;
    loading: boolean = true;
    items: AgencyNoteEntity[];
    @Input() brokerId: number;
    @Input() readonly: boolean;
    item: AgencyNoteEntity = new AgencyNoteEntity();

    constructor() {
        super();
        this.service = AppInjector.get(BrokerService);
    }

    async save() {
        if (this.item) {
            if (await validation(this.item)) {
                this.processing = true;
                let obj: AgencyNoteEntity = _.cloneDeep(this.item);
                return await this.service.addOrUpdateAgencyNote(obj).then(async (result: ResultApi) => {
                    this.processing = false;
                    if (ResultApi.IsSuccess(result)) {
                        let messsage = 'Save node success';
                        ToastrHelper.Success(messsage);
                        await this.loadItems();
                        return true;
                    } else {
                        ToastrHelper.ErrorResult(result);
                        return false;
                    }
                }, () => {
                    this.processing = false;
                    return false;
                });
            }
        }
    }

    async ngOnInit() {
        this.item.AgencyId = this.brokerId;
        await this.loadItems();
        this.loading = false;
    }

    private async loadItems() {
        if (this.brokerId) {
            await this.service.brokerNotes(this.brokerId).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.items = result.Object;
                    if (this.items) {
                        this.items.forEach((item: AgencyNoteEntity) => {
                            item.Character = item.User && item.User.length >= 2
                                ? item.User.substring(0, 2).toUpperCase()
                                : item.User;
                        });
                    }
                }
            });
        }
    }
}
