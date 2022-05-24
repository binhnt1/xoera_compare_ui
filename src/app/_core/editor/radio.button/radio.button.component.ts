import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { ResultApi } from '../../domains/data/result.api';
import { LookupData } from '../../domains/data/lookup.data';
import { OptionItem } from '../../domains/data/option.item';
import { UtilityExHelper } from '../../helpers/utility.helper';
import { BooleanEx } from '../../decorators/boolean.decorator';
import { DecoratorHelper } from '../../helpers/decorator.helper';
import { AdminApiService } from '../../services/admin.api.service';
import { AdminEventService } from '../../services/admin.event.service';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
    selector: 'editor-radio-button',
    templateUrl: 'radio.button.component.html',
    styleUrls: ['radio.button.component.scss']
})
export class RadioButtonComponent implements OnInit, OnDestroy, OnChanges {
    group: string;
    @Input() value: any;
    @Input() items: OptionItem[];
    @Input() decorator: BooleanEx;
    subscribeRefreshItems: Subscription;
    @Output() valueChange = new EventEmitter<any>();

    constructor(
        public event: AdminEventService,
        public service: AdminApiService) {
    }

    async ngOnInit() {
        if (!this.decorator)
            this.decorator = new BooleanEx();
        if (!this.decorator.lookup) this.decorator.lookup = new LookupData();
        this.decorator.id = UtilityExHelper.randomText(8);
        this.group = UtilityExHelper.randomText(8);
        await this.render();

        // subscribe refreshItems
        if (!this.subscribeRefreshItems) {
            this.subscribeRefreshItems = this.event.RefreshItems.subscribe((obj: { property: string, value: any }) => {
                this.loadByDependcy(obj.property, obj.value);
            });
        }
    }

    ngOnDestroy() {
        if (this.subscribeRefreshItems) {
            this.subscribeRefreshItems.unsubscribe();
            this.subscribeRefreshItems = null;
        }
    }

    ngOnChanges(changes: any) {
        if (changes) {
            if (changes.value) {
                if (changes.value.currentValue != changes.value.previousValue) {
                    this.setValue();
                }
            }
        }
    }

    inputChange(item: OptionItem) {
        let selected = item.selected;
        if (this.items && this.items.length > 0) {
            this.items.forEach((item: OptionItem) => {
                item.selected = false;
            });
        }
        this.value = item.value;
        item.selected = !selected;
        this.valueChange.emit(this.value);
    }

    private setValue() {
        if (this.items && this.items.length > 0) {
            if (this.items && this.items.length > 0) {
                this.items.forEach((item: OptionItem) => {
                    item.selected = false;
                    if (this.value == item.value)
                        item.selected = true;
                });
            }
        }
    }

    private async render() {
        let items: OptionItem[];
        if (!this.items) {
            if (this.decorator.lookup.items) {
                items = _.cloneDeep(this.decorator.lookup.items);
            } else if (!this.decorator.lookup.dependId && this.decorator.lookup.url) {
                let columns: any[] = _.cloneDeep(this.decorator.lookup.propertyDisplay || ['Name']);
                columns.unshift(this.decorator.lookup.propertyValue || 'Id');
                if (this.decorator.lookup.propertyGroup)
                    columns.push(this.decorator.lookup.propertyGroup);
                items = await this.service.lookup(this.decorator.lookup.url, columns).then((result: ResultApi) => {
                    return OptionItem.createOptionItems(result, this.decorator);
                });
            }
            this.items = items;
        }
        this.setValue();
    }

    private async loadByDependcy(property: string, value: any) {
        let targetProperty = DecoratorHelper.decoratorProperty(this.decorator.target, property);
        if (this.decorator.lookup &&
            this.decorator.lookup.dependId &&
            this.decorator.lookup.dependId == property) {
            let columns: any[] = _.cloneDeep(this.decorator.lookup.propertyDisplay || ['Name']);
            columns.unshift(this.decorator.lookup.propertyValue || 'Id');
            if (this.decorator.lookup.propertyGroup)
                columns.push(this.decorator.lookup.propertyGroup);
            let items = await this.service.lookup(this.decorator.lookup.url, columns, value).then((result: ResultApi) => {
                return OptionItem.createOptionItems(result, targetProperty);
            });
            this.items = items; this.setValue();
        }
    }
}
