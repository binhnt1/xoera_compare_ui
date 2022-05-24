declare var $;
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { ResultApi } from '../../domains/data/result.api';
import { OptionItem } from '../../domains/data/option.item';
import { LookupData } from '../../domains/data/lookup.data';
import { UtilityExHelper } from '../../helpers/utility.helper';
import { DecoratorHelper } from '../../helpers/decorator.helper';
import { DropDownEx } from '../../decorators/dropdown.decorator';
import { AdminApiService } from '../../services/admin.api.service';
import { AdminEventService } from '../../services/admin.event.service';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
    selector: 'editor-combobox',
    templateUrl: 'combobox.component.html',
    styleUrls: ['combobox.component.scss']
})
export class ComboBoxComponent implements OnInit, OnDestroy, OnChanges {
    type: string;
    @Input() value: any;
    @Input() items: OptionItem[];
    @Input() decorator: DropDownEx;
    subscribeRefreshItems: Subscription;
    @Output() valueChange = new EventEmitter<string>();

    constructor(
        public event: AdminEventService,
        public service: AdminApiService) {
    }

    ngOnDestroy() {
        if (this.subscribeRefreshItems) {
            this.subscribeRefreshItems.unsubscribe();
            this.subscribeRefreshItems = null;
        }
    }

    async ngOnInit() {
        if (!this.decorator)
            this.decorator = new DropDownEx();
        if (!this.decorator.lookup) this.decorator.lookup = new LookupData();
        if (!this.decorator.placeholder) this.decorator.placeholder = '';
        this.decorator.id = UtilityExHelper.randomText(8);
        if (this.items)
            setTimeout(() => { this.reloadItems(this.items); }, 100);
        else
            await this.render();

        // subscribe refreshItems
        if (!this.subscribeRefreshItems) {
            this.subscribeRefreshItems = this.event.RefreshItems.subscribe((obj: { property: string, value: any }) => {
                this.loadByDependcy(obj.property, obj.value);
            });
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

    public reloadItems(items: OptionItem[]) {
        let data: any[] = [];
        if (items) this.items = items;
        if (this.decorator.lookup.propertyGroup) {
            if (items && items.length > 0) {
                let groups = _(items)
                    .groupBy((x: OptionItem) => x.group)
                    .map((value: OptionItem[], key: string) => ({ group: key, items: value }))
                    .value();
                groups.forEach((item: any) => {
                    data.push({
                        id: item.group,
                        text: item.group,
                        children: item.items && item.items.map(c => {
                            return {
                                id: c.value,
                                icon: c.icon,
                                text: c.label,
                            };
                        }) || [],
                    });
                });
                if (!this.value && this.decorator.autoSelect) {
                    let selectItem = data.find(c => c.id);
                    this.value = selectItem && selectItem.id;
                }
                else if (!this.decorator.multiple) data.unshift({ id: '', icon: null, text: this.decorator.placeholder });
            }
        } else {
            data = items && items.map(c => {
                return {
                    id: c.value,
                    icon: c.icon,
                    text: c.label,
                };
            }) || [];
            if (!this.value && this.decorator.autoSelect) {
                let selectItem = data.find(c => c.id);
                this.value = selectItem && selectItem.id;
            }
            else if (!this.decorator.multiple) data.unshift({ id: '', icon: null, text: this.decorator.placeholder });
        }
        let $combobox = $("#" + this.decorator.id);
        if ($combobox && $combobox.length > 0) {
            $combobox.empty().select2({
                data: data,
                multiple: this.decorator.multiple,
                disabled: this.decorator.readonly,
                placeholder: this.decorator.placeholder,
                allowClear: this.decorator.readonly ? false : true,
                minimumResultsForSearch: data.length >= 10 ? 0 : Infinity,
                templateResult: (state: any) => {
                    if (state.icon) {
                        return $('<i class="' + state.icon + '" /> ' + state.text + '</span>');
                    }
                    return state.text;
                },
                templateSelection: (state: any) => {
                    if (state.icon) {
                        return $('<i class="' + state.icon + '" /> ' + state.text + '</span>');
                    }
                    return state.text;
                },
            }).on('select2:select', (e: any) => {
                let items = $combobox.select2('data') || [];
                if (items) {
                    items = items.map(c => c.id) || [];
                }
                this.value = items.length == 0 ? null : items.length == 1 ? items[0] : items;
                this.valueChange.emit(this.value);
                this.event.RefreshItems.emit({
                    value: this.value,
                    property: this.decorator.property,
                });
            }).on('select2:unselect', (e: any) => {
                let items = $combobox.select2('data') || [];
                if (items) {
                    items = items.map(c => c.id) || [];
                }
                this.value = items.length == 0 ? null : items.length == 1 ? items[0] : items;
                this.valueChange.emit(this.value);
                this.event.RefreshItems.emit({
                    value: this.value,
                    property: this.decorator.property,
                });
            }).on('select2:clear', () => {
                this.value = null;
                this.valueChange.emit(this.value);
                this.event.RefreshItems.emit({
                    value: this.value,
                    property: this.decorator.property,
                });
            });
            if (this.value != null) this.setValue();
        }
    }

    private setValue() {
        let $combobox = $("#" + this.decorator.id);
        if ($combobox && $combobox.length > 0) {
            $combobox.val(this.value);
            $combobox.trigger('change');
            this.valueChange.emit(this.value);
            this.event.RefreshItems.emit({
                value: this.value,
                property: this.decorator.property,
            });
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
        setTimeout(() => { this.reloadItems(items); }, 100);
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
            this.reloadItems(items);
        }
    }
}
