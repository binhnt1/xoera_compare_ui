declare var $;
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { ApiUrl } from '../../helpers/api.url.helper';
import { StoreHelper } from '../../helpers/store.helper';
import { ResultApi } from '../../domains/data/result.api';
import { OptionItem } from '../../domains/data/option.item';
import { LookupData } from '../../domains/data/lookup.data';
import { UtilityExHelper } from '../../helpers/utility.helper';
import { DecoratorHelper } from '../../helpers/decorator.helper';
import { DropDownEx } from '../../decorators/dropdown.decorator';
import { AdminApiService } from '../../services/admin.api.service';
import { AdminEventService } from '../../services/admin.event.service';
import { DropdownLoadType, DropdownType } from '../../domains/enums/data.type';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
    selector: 'editor-combobox',
    templateUrl: 'combobox.component.html',
    styleUrls: ['combobox.component.scss']
})
export class ComboBoxComponent implements OnInit, OnDestroy, OnChanges {
    url: string;
    type: string;
    valueTo: number;
    loading: boolean;
    valueFrom: number;
    panelOpening: boolean;
    loadingDependcy: boolean;
    selectedItem: OptionItem;
    valueText: string = null;
    DropdownType = DropdownType;
    activeChangeEvent: boolean = false;
    subscribeRefreshItems: Subscription;
    subscribeHideCombobox: Subscription;
    keyNumbers: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    keys: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ',', 'Backspace', 'Delete', 'Alt', 'Home', 'End', 'Tab', 'ArrowLeft', 'ArrowRight'];

    @Input() value: any;
    @Input() items: OptionItem[];
    @Input() decorator: DropDownEx;
    @Output() valueChange = new EventEmitter<string>();
    @Output() loaded = new EventEmitter<OptionItem[]>();

    constructor(
        public event: AdminEventService,
        public service: AdminApiService) {
    }

    ngOnDestroy() {
        if (this.subscribeRefreshItems) {
            this.subscribeRefreshItems.unsubscribe();
            this.subscribeRefreshItems = null;
        }
        if (this.subscribeHideCombobox) {
            this.subscribeHideCombobox.unsubscribe();
            this.subscribeHideCombobox = null;
        }
    }

    async ngOnInit() {
        if (!this.decorator)
            this.decorator = new DropDownEx();
        this.decorator.id = UtilityExHelper.randomText(8);
        if (!this.decorator.placeholder) this.decorator.placeholder = '';
        if (!this.decorator.type) this.decorator.type = DropdownType.Normal;
        if (!this.decorator.lookup) this.decorator.lookup = new LookupData();
        if (!this.decorator.lookup.propertyValue) this.decorator.lookup.propertyValue = 'Id';
        if (this.decorator.multiple && this.value && this.value.length == 0) this.value = null;
        if (!this.decorator.lookup.propertyDisplay) this.decorator.lookup.propertyDisplay = ['Name'];
        if (this.items)
            setTimeout(() => { this.reloadItems(this.items); }, 100);
        else
            await this.renderAndLoadItems();

        // subscribe refreshItems
        if (!this.subscribeRefreshItems) {
            this.subscribeRefreshItems = this.event.RefreshItems.subscribe((obj: { property: string, value: any }) => {
                if (!this.loadingDependcy) {
                    this.loadingDependcy = true;
                    this.loadByDependcy(obj.property, obj.value);
                }
            });
        }

        // subscribe refreshItems
        if (!this.subscribeHideCombobox) {
            this.subscribeHideCombobox = this.event.HideCombobox.subscribe(() => {
                let $combobox = $("#" + this.decorator.id);
                if ($combobox && $combobox.length > 0) {
                    $combobox.select2('close');
                }
            });
        }
        setTimeout(() => this.activeChangeEvent = true, 1000);
    }

    ngOnChanges(changes: any) {
        if (changes) {
            if (changes.value) {
                if (changes.value.currentValue != changes.value.previousValue && this.activeChangeEvent) {
                    this.setValue();
                }
            } else {
                this.setValue();
            }
        }
    }

    clear() {
        this.activeChangeEvent = false;
        this.value = null; this.setValue();
        setTimeout(() => this.activeChangeEvent = true, 500);
    }
    clearTo() {
        this.valueTo = null;
        this.updateValueText();
    }
    selectAll() {
        this.activeChangeEvent = false;
        if (this.items && this.items.length > 0) {
            let $combobox = $("#" + this.decorator.id);
            if ($combobox && $combobox.length > 0) {
                this.value = this.items.map(c => c.value);
                $combobox.val(this.value);
                $combobox.trigger('change');
                this.valueChange.emit(this.value);
            }
        }
        setTimeout(() => this.activeChangeEvent = true, 500);
    }
    clearFrom() {
        this.valueFrom = null;
        this.updateValueText();
    }
    clearFromTo() {
        this.valueTo = null;
        this.valueFrom = null;
        this.updateValueText();
        this.selectedItem = null;
        $('#to-' + this.decorator.id).val('');
        $('#from-' + this.decorator.id).val('');
    }
    inputBlur(type: string) {
        setTimeout(() => {
            if (!this.panelOpening) {
                let valueFrom = this.formatNumber(this.valueFrom),
                    valueTo = this.formatNumber(this.valueTo);
                if (type == 'from') {
                    if (this.valueTo != null && this.valueTo != undefined) {
                        if (valueFrom && valueTo < valueFrom) {
                            this.valueTo = valueFrom;
                            let num = this.formatNumber(this.valueTo);
                            setTimeout(() => {
                                let valueText = this.formatString(num);
                                $('#to-' + this.decorator.id).val(valueText);
                            }, 100);
                            this.updateValueText();
                        }
                    }
                } else {
                    if (this.valueFrom != null && this.valueFrom != undefined) {
                        if (valueTo && valueFrom > valueTo) {
                            this.valueFrom = 0;
                            let num = this.formatNumber(this.valueFrom);
                            setTimeout(() => {
                                let valueText = this.formatString(num);
                                $('#from-' + this.decorator.id).val(valueText);
                            }, 100);
                            this.updateValueText();
                        }
                    }
                }
            }
        }, 300);
    }
    onNumberKeypress(e: any) {
        let key = e.key,
            val = e.target.value;
        if (e.ctrlKey && (key == 'c' || key == 'a'))
            return true;
        if (!this.decorator.lookup.decimals) {
            if (key == ',') return false;
            if (!val && key == '0') {
                return true;
            }
        } else {
            if (key == ',') {
                if (!val || val.indexOf(',') >= 0)
                    return false;
                else
                    return true;
            }
        }
        if (this.keys.indexOf(key) < 0) return false;
        if (val && this.decorator.lookup.decimals && this.keyNumbers.indexOf(key) >= 0) {
            const [, decimal] = val.toString().split(',');
            const precision = decimal ? decimal.length : 0;
            if (precision >= this.decorator.lookup.decimals)
                return false;
        }
        return true;
    }
    inputChange(type: string) {
        if (type == 'from') {
            let num = this.formatNumber(this.valueFrom);
            if (num > this.decorator.lookup?.numberMax) {
                this.valueFrom = this.decorator.lookup?.numberMax;
                num = this.formatNumber(this.valueFrom);
            }
            let numTo = this.formatNumber(this.valueTo);
            if (numTo && num > numTo) {
                this.valueFrom = 0;
                num = this.formatNumber(this.valueFrom);
            }
            if (this.valueFrom != null &&
                this.valueFrom != undefined &&
                this.valueFrom.toString() != '' &&
                !this.valueFrom.toString().endsWith(',') &&
                !this.valueFrom.toString().endsWith(',0')) {
                setTimeout(() => {
                    let valueText = this.formatString(num);
                    $('#from-' + this.decorator.id).val(valueText);
                }, 100);
            }
        } else {
            let num = this.formatNumber(this.valueTo);
            if (num > this.decorator.lookup?.numberMax) {
                this.valueTo = this.decorator.lookup?.numberMax;
                num = this.formatNumber(this.valueTo);
            }
            if (this.valueTo != null &&
                this.valueTo != undefined &&
                this.valueTo.toString() != '' &&
                !this.valueTo.toString().endsWith(',') &&
                !this.valueTo.toString().endsWith(',0')) {
                setTimeout(() => {
                    let valueText = this.formatString(num);
                    $('#to-' + this.decorator.id).val(valueText);
                }, 100);
            }
        }
        let itemDb = this.items && this.items.find(c => c.value == this.selectedItem?.value);
        if (itemDb) {
            itemDb.selected = false;
            this.selectedItem = null;
        }
        this.updateValueText();
    }
    selectItem(item: OptionItem) {
        if (this.items && this.items.length > 0) {
            this.items.forEach((item: OptionItem) => {
                item.selected = false;
            });
        }
        let itemDb = this.items && this.items.find(c => c.value == item.value);
        if (itemDb) {
            itemDb.selected = true;
            this.selectedItem = itemDb;
        } else this.selectedItem = null;
        this.updateValueText();
    }
    public reloadItems(items: OptionItem[]) {
        this.activeChangeEvent = false;
        if (items) this.items = items;
        if (this.decorator.type == DropdownType.Normal) {
            let data: any[] = [];
            let group = this.items && this.items.find(c => c.group);
            let groupArray = this.items && _.uniqBy(this.items.map(c => c.group).filter(c => c != null), (c: string) => { return c });
            if (groupArray && groupArray.length > 0 && (group || this.decorator.lookup.propertyGroup)) {
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
                if (this.decorator.lookup.loadType == DropdownLoadType.Ajax) {
                    this.renderEditorAjax($combobox, data);
                } else {
                    this.renderEditor($combobox, data);
                    if (this.value != null && this.value != undefined) {
                        if (this.decorator.multiple) {
                            if (this.value.length > 0) this.setValue();
                        } else
                            this.setValue();
                    } else if (this.decorator.text) {
                        let $render = $('#select2-' + this.decorator.id + '-container');
                        if ($render && $render.length > 0) {
                            $render.html(this.decorator.text);
                        }
                    }
                }
            }
        } else this.setValue();
        this.loaded.emit(items);
        setTimeout(() => this.activeChangeEvent = true, 1000);
    }

    private setValue() {
        if (this.decorator.type == DropdownType.Normal) {
            let $combobox = $("#" + this.decorator.id);
            if ($combobox && $combobox.length > 0) {
                if (this.value == null || this.value == undefined) {
                    this.valueChange.emit(this.value);
                    this.event.RefreshItems.emit({
                        value: this.value,
                        property: this.decorator.property,
                    });
                    $combobox.val(null).trigger('change');
                } else {
                    if (typeof (this.value) == 'string') {
                        if (this.decorator.multiple) {
                            this.value = this.value.indexOf(',') >= 0 || this.value.indexOf('[') >= 0
                                ? this.value.replace('[', '').replace(']', '').split(',')
                                : [this.value];
                        }
                    }
                    if (this.decorator.lookup.loadType == DropdownLoadType.All) {
                        if (this.decorator.multiple) {
                            if (this.value && this.value.length > 0) {
                                $combobox.val(this.value);
                                $combobox.trigger('change');
                                this.valueChange.emit(this.value);
                                this.event.RefreshItems.emit({
                                    value: this.value,
                                    property: this.decorator.property,
                                });
                            }
                        } else {
                            $combobox.val(this.value);
                            $combobox.trigger('change');
                            this.valueChange.emit(this.value);
                            this.event.RefreshItems.emit({
                                value: this.value,
                                property: this.decorator.property,
                            });
                        }
                    } else {
                        let selected = {
                            id: this.value,
                            text: this.value,
                        };
                        if (this.items && this.items.length > 0) {
                            let item = this.items.find(c => c.value == this.value);
                            if (item)
                                selected = { id: item.value, text: item.label };
                        }
                        let option = selected && selected.id
                            ? new Option(selected.text, selected.id, true, true)
                            : null;
                        if (option) {
                            $combobox.append(option).trigger('change');
                            $combobox.trigger({
                                type: 'select2:select',
                                params: {
                                    data: selected
                                }
                            });
                        } else {
                            $combobox.val(null).trigger('change');
                        }
                        this.valueChange.emit(this.value);
                        this.event.RefreshItems.emit({
                            value: this.value,
                            property: this.decorator.property,
                        });
                    }
                }
            }
        } else {
            if (typeof (this.value) == 'string') {
                let values = this.value.split('-');
                if (values.length >= 3) {
                    this.valueFrom = values[0] ? this.formatNumber(values[0]) : null;
                    this.valueTo = values[1] ? this.formatNumber(values[1]) : null;
                    this.updateValueText();
                } else {
                    if (this.items) {
                        let value = this.value;
                        if (value.indexOf('-null') >= 0)
                            value = value.replace('-null', '');
                        if (value.indexOf('null-') >= 0)
                            value = value.replace('null-', '');
                        let option = this.items && this.items.find(c => c.value == value);
                        if (option) {
                            option.selected = true;
                            this.selectedItem = option;
                            this.updateValueText();
                        } else if (values && values.length >= 2) {
                            this.valueFrom = values[0] ? this.formatNumber(values[0]) : null;
                            this.valueTo = values[1] ? this.formatNumber(values[1]) : null;
                            this.updateValueText();
                        }
                    }
                }
            }
        }
    }
    private updateValueText() {
        this.activeChangeEvent = false;
        if (this.selectedItem) {
            this.valueTo = null;
            this.valueFrom = null;
            this.panelOpening = false;
            this.value = this.selectedItem?.value;
            this.valueText = this.selectedItem?.label;
            this.valueChange.emit(this.value);
            this.event.RefreshItems.emit({
                value: this.value,
                property: this.decorator.property,
            });
        } else {
            let valueText = '';
            let valueNumber = '';
            if (this.valueFrom && this.valueTo) {
                let valueFrom = this.formatNumber(this.valueFrom),
                    valueTo = this.formatNumber(this.valueTo);
                valueNumber = valueFrom + '-' + valueTo + '-E';
                switch (this.decorator.type) {
                    case DropdownType.Between: {
                        valueText += this.formatString(valueFrom);
                        valueText += ' - ';
                        valueText += this.formatString(valueTo);
                        valueText += ' ' + this.decorator.lookup?.unit;
                    }
                        break;
                    case DropdownType.BetweenArea: {
                        let unitFrom = UtilityExHelper.FormatUnitArea(valueFrom),
                            unitTo = UtilityExHelper.FormatUnitArea(valueTo);
                        valueText += UtilityExHelper.FormatNumberArea(valueFrom);
                        valueText += unitFrom != unitTo ? unitFrom : '';
                        valueText += ' - ';
                        valueText += UtilityExHelper.FormatNumberArea(valueTo);
                        valueText += unitTo;
                    }
                        break;
                    case DropdownType.BetweenPrice: {
                        let unitFrom = UtilityExHelper.FormatUnitPrice(valueFrom),
                            unitTo = UtilityExHelper.FormatUnitPrice(valueTo);
                        valueText += UtilityExHelper.FormatNumberPrice(valueFrom);
                        valueText += unitFrom != unitTo ? unitFrom : '';
                        valueText += ' - ';
                        valueText += UtilityExHelper.FormatNumberPrice(valueTo);
                        valueText += unitTo;
                    }
                        break;
                }
            } else if (this.valueFrom) {
                valueText += 'Trên ';
                let valueFrom = this.formatNumber(this.valueFrom);
                valueNumber = valueFrom + '-0-E';
                switch (this.decorator.type) {
                    case DropdownType.Between: {
                        valueText += this.formatString(valueFrom);
                        valueText += ' ' + this.decorator.lookup?.unit;
                    }
                        break;
                    case DropdownType.BetweenArea: {
                        valueText += UtilityExHelper.FormatNumberArea(valueFrom);
                        valueText += UtilityExHelper.FormatUnitArea(valueFrom);
                    }
                        break;
                    case DropdownType.BetweenPrice: {
                        valueText += UtilityExHelper.FormatNumberPrice(valueFrom);
                        valueText += UtilityExHelper.FormatUnitPrice(valueFrom);
                    }
                        break;
                }
            } else if (this.valueTo) {
                valueText += 'Dưới ';
                let valueTo = this.formatNumber(this.valueTo);
                valueNumber = '0-' + valueTo + '-E';
                switch (this.decorator.type) {
                    case DropdownType.Between: {
                        valueText += this.formatString(valueTo);
                        valueText += ' ' + this.decorator.lookup?.unit;
                    }
                        break;
                    case DropdownType.BetweenArea: {
                        valueText += UtilityExHelper.FormatNumberArea(valueTo);
                        valueText += UtilityExHelper.FormatUnitArea(valueTo);
                    }
                        break;
                    case DropdownType.BetweenPrice: {
                        valueText += UtilityExHelper.FormatNumberPrice(valueTo);
                        valueText += UtilityExHelper.FormatUnitPrice(valueTo);
                    }
                        break;
                }
            }
            this.value = valueNumber;
            this.valueText = valueText;
            this.valueChange.emit(this.value);
            this.event.RefreshItems.emit({
                value: this.value,
                property: this.decorator.property,
            });
        }
        setTimeout(() => this.activeChangeEvent = true, 1000);
    }
    private formatNumber(value: any) {
        if (typeof value == 'string') {
            let val = (value || 0).toString();
            while (val.indexOf('.') >= 0) val = val.replace('.', '');
            while (val.indexOf(',') >= 0) val = val.replace(',', '.');
            let num = Number(val);
            return num;
        } return value;
    }
    private async renderAndLoadItems() {
        let items: OptionItem[];
        if (this.decorator.lookup.items) {
            items = _.cloneDeep(this.decorator.lookup.items);
        } else if (!this.decorator.lookup.dependId && this.decorator.lookup.url) {
            let columns: any[] = _.cloneDeep(this.decorator.lookup.propertyDisplay || ['Name']);
            columns.unshift(this.decorator.lookup.propertyValue || 'Id');
            if (this.decorator.lookup.propertyGroup)
                columns.push(this.decorator.lookup.propertyGroup);
            this.loading = true;
            let url = this.formatUrl(this.decorator.lookup.url),
                key = this.decorator.lookup.url;
            while (key.indexOf('/') >= 0)
                key = key.replace('/', '_');
            if (this.decorator.lookup.params) {
                let keys = Object.keys(this.decorator.lookup.params);
                if (keys && keys.length > 0) {
                    keys.forEach((item: any) => {
                        url += url.indexOf('?') >= 0
                            ? '&' + item + '=' + this.decorator.lookup.params[item]
                            : '?' + item + '=' + this.decorator.lookup.params[item];
                    });
                }
            }

            // get from cache
            items = StoreHelper.loadStoreItemWithExpiry(key);

            // get from api
            if (!items || items.length == 0) {
                items = await this.service.lookup(url, columns).then((result: ResultApi) => {
                    return OptionItem.createOptionItems(result, this.decorator, this.decorator.lookup.emptyItem);
                });
            }

            // cache
            if (this.decorator.lookup.cached && items && items.length > 0) {
                let ttl = this.decorator.lookup.cached;
                StoreHelper.storeItem(key, items, ttl);
            }
            this.loading = false;
        }
        setTimeout(() => { this.reloadItems(items); }, 100);
    }
    private formatString(value: number) {
        if (value == null || value == undefined)
            return '';
        return value.toLocaleString('vi-VN');
    }
    private formatUrl(url: string): string {
        if (url && url.indexOf('[id]') >= 0) {
            let searchParams = new URLSearchParams(location.search);
            if (searchParams.has('id')) {
                let id = searchParams.get("id");
                if (id) url = url.replace('[id]', id);
            }
        }
        return url;
    }
    private async renderEditor($combobox: any, data: any) {
        // destroy
        if ($combobox.hasClass("select2-hidden-accessible")) {
            $combobox.select2("destroy");
        }
        $combobox.empty().select2({
            data: data,
            multiple: this.decorator.multiple,
            placeholder: this.decorator.placeholder,
            maximumSelectionLength: this.decorator.max || 100,
            minimumResultsForSearch: data.length >= 10 || this.decorator.allowSearch ? 0 : Infinity,
            allowClear: this.decorator.readonly || this.decorator.multiple ? false : this.decorator.allowClear,
            matcher: (params: any, data: any) => {
                if (!params.term) return data;
                else {
                    let original_matcher = $.fn.select2.defaults.defaults.matcher;
                    let result = original_matcher(params, data);
                    if (result && data.children && result.children && data.children.length != result.children.length && data.text.toLowerCase().includes(params.term.toLowerCase())) {
                        result.children = data.children;
                    }
                    return result;
                }
            },
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
            this.value = items.length == 0
                ? null
                : this.decorator.multiple ? items : items[0];
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
            this.value = items.length == 0
                ? null
                : this.decorator.multiple ? items : items[0];
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
    }
    private async renderEditorAjax($combobox: any, data: any) {
        // destroy
        if ($combobox.hasClass("select2-hidden-accessible")) {
            $combobox.select2("destroy");
        }
        let targetProperty = DecoratorHelper.decoratorProperty(this.decorator.target, this.decorator.property);
        $combobox.empty().select2({
            data: data,
            minimumInputLength: 0,
            multiple: this.decorator.multiple,
            placeholder: this.decorator.placeholder,
            maximumSelectionLength: this.decorator.max || 100,
            allowClear: this.decorator.readonly || this.decorator.multiple ? false : this.decorator.allowClear,
            ajax: {
                url: () => {
                    return ApiUrl.ToUrl(this.url || '/admin' + this.decorator.lookup.url);
                },
                delay: 250,
                cache: false,
                dataType: 'json',
                data: (params: any) => {
                    return {
                        q: params.term,
                        page: params.page || 1
                    };
                },
                processResults: (result: ResultApi, params: any) => {
                    let items = OptionItem.createOptionItems(result, targetProperty);
                    this.items = items;
                    let data = items && items.map(c => {
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

                    params.page = params.page || 1;
                    return {
                        results: data,
                        pagination: {
                            more: items && items.length > 100
                        }
                    };
                },
            },
            matcher: (params: any, data: any) => {
                if (!params.term) return data;
                else {
                    let original_matcher = $.fn.select2.defaults.defaults.matcher;
                    let result = original_matcher(params, data);
                    if (result && data.children && result.children && data.children.length != result.children.length && data.text.toLowerCase().includes(params.term.toLowerCase())) {
                        result.children = data.children;
                    }
                    return result;
                }
            },
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
            this.activeChangeEvent = false;
            let items = $combobox.select2('data') || [],
                selectedIds = items?.map(c => c.id) || [];
            let value = items.length == 0
                ? null
                : this.decorator.multiple ? selectedIds : selectedIds[0];
            this.value = value;
            this.valueChange.emit(value);
            this.event.RefreshItems.emit({
                value: value,
                property: this.decorator.property,
            });
            setTimeout(() => this.activeChangeEvent = true, 500);
        }).on('select2:unselect', (e: any) => {
            this.activeChangeEvent = false;
            let items = $combobox.select2('data') || [],
                selectedIds = items?.map(c => c.id) || [];
            let value = items.length == 0
                ? null
                : this.decorator.multiple ? selectedIds : selectedIds[0];
            this.value = value;
            this.valueChange.emit(value);
            this.event.RefreshItems.emit({
                value: value,
                property: this.decorator.property,
            });
            setTimeout(() => this.activeChangeEvent = true, 500);
        }).on('select2:clear', () => {
            this.activeChangeEvent = false;
            this.value = null;
            this.valueChange.emit(this.value);
            this.event.RefreshItems.emit({
                value: this.value,
                property: this.decorator.property,
            });
            $combobox.val(null).trigger('change');
            setTimeout(() => this.activeChangeEvent = true, 500);
        });

        if (this.decorator.lookup.selected) {
            if (Array.isArray(this.decorator.lookup.selected)) {
                let selecteds = this.decorator.lookup.selected.filter(c => c.value).map(c => {
                    return {
                        id: c.value,
                        text: c.label,
                    }
                });
                if (selecteds && selecteds.length > 0) {
                    let options = selecteds.map(c => {
                        return new Option(c.text, c.id, true, true)
                    });
                    $combobox.append(options).trigger('change');
                    $combobox.trigger({
                        type: 'select2:select',
                        params: {
                            data: selecteds
                        }
                    });
                }
            } else {
                let selected = {
                    id: this.decorator.lookup.selected.value,
                    text: this.decorator.lookup.selected.label,
                };
                let option = new Option(selected.text, selected.id, true, true);
                $combobox.append(option).trigger('change');
                $combobox.trigger({
                    type: 'select2:select',
                    params: {
                        data: selected
                    }
                });
            }
        }
    }
    private async loadByDependcy(property: string, value: any) {
        if (this.decorator.target &&
            this.decorator.lookup &&
            this.decorator.lookup.dependId &&
            this.decorator.lookup.dependId == property) {
            if (this.decorator.lookup.loadType == DropdownLoadType.All) {
                if (value) {
                    let targetProperty = DecoratorHelper.decoratorProperty(this.decorator.target, this.decorator.property);
                    let columns: any[] = _.cloneDeep(this.decorator.lookup.propertyDisplay || ['Name']);
                    columns.unshift(this.decorator.lookup.propertyValue || 'Id');
                    this.loading = true;
                    if (this.decorator.lookup.propertyGroup)
                        columns.push(this.decorator.lookup.propertyGroup);
                    let items = await this.service.lookup(this.decorator.lookup.url, columns, value).then((result: ResultApi) => {
                        if (value) this.url = this.decorator.lookup.url + '/' + value;
                        return OptionItem.createOptionItems(result, targetProperty);
                    });
                    this.loading = false;
                    if (items && items.length > 0) {
                        if (!this.decorator.multiple) {
                            if (this.decorator.type == DropdownType.Normal) {
                                let option = items.find(c => c.value == this.value);
                                if (!option) {
                                    this.value = null; this.setValue();
                                }
                            }
                        } else {
                            if (this.value) this.setValue();
                        }
                    } else {
                        this.value = null; this.setValue();
                    }
                    this.reloadItems(items);
                } else {
                    this.value = null; this.setValue();
                    this.reloadItems([]);
                }
            } else {
                if (value) this.url = '/admin' + this.decorator.lookup.url + '/' + value;
                else this.url = '/admin' + this.decorator.lookup.url;
            }
        }
        this.loadingDependcy = false;
    }
}
