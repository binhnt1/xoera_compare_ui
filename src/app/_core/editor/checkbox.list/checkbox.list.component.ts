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
    selector: 'editor-checkbox-list',
    templateUrl: 'checkbox.list.component.html',
    styleUrls: ['checkbox.list.component.scss']
})
export class CheckBoxListComponent implements OnInit, OnDestroy, OnChanges {
    values: any[];
    @Input() value: any;
    @Input() items: OptionItem[];
    @Input() decorator: BooleanEx;
    subscribeRefreshItems: Subscription;
    @Output() valueChange = new EventEmitter<string>();

    constructor(
        public event: AdminEventService,
        public service: AdminApiService) {
    }

    async ngOnInit() {
        if (!this.decorator)
            this.decorator = new BooleanEx();
        if (!this.decorator.lookup) this.decorator.lookup = new LookupData();
        this.decorator.id = UtilityExHelper.randomText(8);
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
        item.selected = !item.selected;
        let items = this.items.filter(c => c.selected).map(c => c.value);
        this.value = JSON.stringify(items);
        this.valueChange.emit(this.value);
    }

    private setValue() {
        if (this.items && this.items.length > 0) {
            if (this.value) {
                let values = Array.isArray(this.value)
                    ? this.value
                    : JSON.parse(this.value);
                if (values) values = values.filter(onlyUnique);
                this.items.forEach((item: OptionItem) => {
                    item.selected = false;
                    values.forEach((value: any) => {
                        if (value == item.value)
                            item.selected = true;
                    });
                });
            } else {
                this.items.forEach((item: OptionItem) => {
                    item.selected = false;
                });
            }
        }
    }

    private async render() {
        let items: OptionItem[];
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
        this.items = items; this.setValue();
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

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}