import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from '@angular/core';
import { BrokerLeadService } from '../broker.lead.service';
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { BrokerLeadNoteEntity } from '../../../../_core/domains/entities/broker.lead.note.entity';

@Component({
    selector: 'broker-lead-note',
    templateUrl: './broker.lead.note.component.html',
    styleUrls: ['./broker.lead.note.component.scss']
})
export class BrokerLeadNoteComponent extends EditComponent implements OnInit {
    service: BrokerLeadService;
    loading: boolean = true;
    items: BrokerLeadNoteEntity[];
    @Input() brokerLeadId: number;
    item: BrokerLeadNoteEntity = new BrokerLeadNoteEntity();

    constructor() {
        super();
        this.service = AppInjector.get(BrokerLeadService);
    }

    async save() {
        if (this.item) {
            if (await validation(this.item)) {
                this.processing = true;
                let obj: BrokerLeadNoteEntity = _.cloneDeep(this.item);
                return await this.service.addOrUpdateBrokerLeadNote(obj).then(async (result: ResultApi) => {
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
        this.item.BrokerLeadId = this.brokerLeadId;
        await this.loadItems();
        this.loading = false;
    }

    private async loadItems() {
        if (this.brokerLeadId) {
            await this.service.brokerLeadNotes(this.brokerLeadId).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.items = result.Object;
                    if (this.items) {
                        this.items.forEach((item: BrokerLeadNoteEntity) => {
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
