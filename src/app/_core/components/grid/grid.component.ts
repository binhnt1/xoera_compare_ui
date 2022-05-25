declare var $: any
import * as _ from 'lodash';
import { Subscription, Subject } from 'rxjs';
import { AppInjector } from '../../../app.module';
import { EnumHelper } from '../../helpers/enum.helper';
import { NavigationEnd, Router } from '@angular/router';
import { GridData } from '../../domains/data/grid.data';
import { ResultApi } from '../../domains/data/result.api';
import { TableData } from '../../domains/data/table.data';
import { ToastrHelper } from '../../helpers/toastr.helper';
import { OrderType } from '../../domains/enums/order.type';
import { EntityHelper } from '../../helpers/entity.helper';
import { FilterData } from '../../domains/data/filter.data';
import { PagingData } from '../../domains/data/paging.data';
import { ActionData } from '../../domains/data/action.data';
import { OptionItem } from '../../domains/data/option.item';
import { DialogType } from '../../domains/enums/dialog.type';
import { ResultType } from '../../domains/enums/result.type';
import { ObjectEx } from '../../decorators/object.decorator';
import { MessageHelper } from '../../helpers/message.helper';
import { ExportType } from '../../domains/enums/export.type';
import { StringEx } from '../../decorators/string.decorator';
import { NumberEx } from '../../decorators/number.decorator';
import { ActionType } from '../../domains/enums/action.type';
import { SortingData } from '../../domains/data/sorting.data';
import { CompareType } from '../../domains/enums/compare.type';
import { UtilityExHelper } from '../../helpers/utility.helper';
import { BooleanEx } from '../../decorators/boolean.decorator';
import { BaseEntity } from '../../domains/entities/base.entity';
import { PropertyData } from '../../domains/data/property.data';
import { DecoratorHelper } from '../../helpers/decorator.helper';
import { DropDownEx } from '../../decorators/dropdown.decorator';
import { DateTimeEx } from '../../decorators/datetime.decorator';
import { AdminApiService } from '../../services/admin.api.service';
import { ModalSizeType } from '../../domains/enums/modal.size.type';
import { TabFilterType } from '../../domains/enums/tab.filter.type';
import { BreadcrumbData } from '../../domains/data/breadcrumb.data';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AdminAuthService } from '../../services/admin.auth.service';
import { HistoryComponent } from '../edit/history/history.component';
import { AdminEventService } from '../../services/admin.event.service';
import { AdminDialogService } from '../../services/admin.dialog.service';
import { NavigationStateData } from '../../domains/data/navigation.state';
import { DataType, DateTimeType, StringType } from '../../domains/enums/data.type';
import { ModalExportDataComponent } from '../../modal/export.data/export.data.component';
import { Component, ComponentFactoryResolver, ComponentRef, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
    templateUrl: './grid.component.html'
})
export abstract class GridComponent {
    obj: GridData;
    router: Router;
    objFilter: any;
    message: string;
    loading: boolean;
    itemTotal: number;
    checkAll: boolean;
    mergeCount: number;
    rowSelected: number;
    randomClass: string;
    items: BaseEntity[];
    checkedAll: boolean;
    DataType = DataType;
    summaryText: string;
    prepareForm: boolean;
    notMergeCount: number;
    selectedIds: number[];
    OrderType = OrderType;
    totalItem: BaseEntity;
    filterLength: number[];
    searchClicked: boolean;
    StringType = StringType;
    ActionType = ActionType;
    cloneItems: BaseEntity[];
    inlineFilters: ObjectEx[];
    customFilters: ObjectEx[];
    properties: PropertyData[];
    state: NavigationStateData;
    queryCustomFilter: boolean;
    originalItems: BaseEntity[];
    activeCustomFilter: boolean;
    DateTimeType = DateTimeType;
    activeChoiceColumn: boolean;
    breadcrumbs: BreadcrumbData[];
    TabFilterType = TabFilterType;
    activeProperties: PropertyData[];
    activeStatisticalComponent: boolean;
    activeTotalProperties: PropertyData[];
    itemData: TableData = new TableData();
    @ViewChild('fileInput') fileInput: ElementRef;

    // Service
    event: AdminEventService;
    authen: AdminAuthService;
    service: AdminApiService;
    dialogService: AdminDialogService;

    boolFilterTypes: OptionItem[] = [];
    numberFilterTypes: OptionItem[] = [];
    stringFilterTypes: OptionItem[] = [];
    foreignFilterTypes: OptionItem[] = [];
    datetimeFilterTypes: OptionItem[] = [];
    private subItemFilterSearchChanged: Subscription;
    private componentFactoryResolver: ComponentFactoryResolver;
    private itemFilterSearchChanged: Subject<string> = new Subject();

    componentInstance: any;
    componentRef: ComponentRef<any>;
    @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;

    componentEmbedInstance: any;
    componentEmbedRef: ComponentRef<any>;
    @ViewChild('containerEmbed', { read: ViewContainerRef }) containerEmbed: ViewContainerRef;

    constructor() {
        this.router = AppInjector.get(Router);
        this.event = AppInjector.get(AdminEventService);
        this.authen = AppInjector.get(AdminAuthService);
        this.service = AppInjector.get(AdminApiService);
        this.dialogService = AppInjector.get(AdminDialogService);
        this.componentFactoryResolver = AppInjector.get(ComponentFactoryResolver);

        this.randomClass = UtilityExHelper.randomText(8);
        let compares = EnumHelper.exportCompareOptionItems(CompareType);
        compares.forEach((item: OptionItem) => {
            let newItem: OptionItem = _.cloneDeep(item);
            newItem.label = UtilityExHelper.createLabel(item.label.split('_')[1]);

            if (item.label.startsWith('B')) this.boolFilterTypes.push(newItem);
            else if (item.label.startsWith('N')) this.numberFilterTypes.push(newItem);
            else if (item.label.startsWith('S')) this.stringFilterTypes.push(newItem);
            else if (item.label.startsWith('F')) this.foreignFilterTypes.push(newItem);
            else if (item.label.startsWith('D')) this.datetimeFilterTypes.push(newItem);
        });

        this.state = this.getUrlState();
        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                if (this.breadcrumbs && this.breadcrumbs.length > 0)
                    return;
                this.breadcrumbs = [];
                let currentUrl = val.url.replace('/edit', '').replace('/view', '');
                if (this.authen && this.authen.links && this.authen.links.length > 0) {
                    this.authen.links.forEach((group: any) => {
                        if (group.items && group.items.length > 0) {
                            group.items.forEach((item: any) => {
                                if (this.breadcrumbs.length == 0) {
                                    if (item.Childrens && item.Childrens.length > 0) {
                                        item.Childrens.forEach((child: any) => {
                                            if (child.Link != '/') {
                                                if (child.Link == currentUrl) {
                                                    if (item.Group)
                                                        this.breadcrumbs.push({ Name: item.Group });
                                                    this.breadcrumbs.push({ Name: item.Name });
                                                    this.breadcrumbs.push({ Name: child.Name, Link: child.Link });
                                                } else if (currentUrl.indexOf(child.Link) >= 0) {
                                                    let existChild = item.Childrens.find(c => c.Link == currentUrl);
                                                    if (!existChild) {
                                                        if (item.Group)
                                                            this.breadcrumbs.push({ Name: item.Group });
                                                        this.breadcrumbs.push({ Name: item.Name });
                                                        this.breadcrumbs.push({ Name: child.Name, Link: child.Link });
                                                    }
                                                }
                                            }
                                        });
                                    } else {
                                        if (item.Link != '/') {
                                            if (item.Link == currentUrl) {
                                                if (item.Group)
                                                    this.breadcrumbs.push({ Name: item.Group });
                                                this.breadcrumbs.push({ Name: item.Name, Link: item.Link });
                                            } else if (currentUrl.indexOf(item.Link) >= 0) {
                                                let existChild = item.Childrens.find(c => c.Link == currentUrl);
                                                if (!existChild) {
                                                    if (item.Group)
                                                        this.breadcrumbs.push({ Name: item.Group });
                                                    this.breadcrumbs.push({ Name: item.Name, Link: item.Link });
                                                }
                                            }
                                        }
                                    }
                                }
                            });
                        }
                    });
                }
            }
        });
    }

    back() {
        if (this.state)
            this.router.navigate([this.state.prevUrl], { state: { params: JSON.stringify(this.state) } });
        else
            window.history.back();
    }

    addNew() {
        this.prepareForm = true;
        setTimeout(() => {
            this.dialogService.Dialog({
                object: null,
                objectExtra: this.obj,
                cancelFunction: () => {
                    this.prepareForm = false;
                },
                okFunction: () => {
                    this.loadItems();
                    this.prepareForm = false;
                },
                type: DialogType.AdminEdit,
            });
        }, 300);
    }

    search() {
        this.searchClicked = true;
        if (!this.itemData.Paging)
            this.itemData.Paging = new PagingData();
        this.itemData.Paging.Index = 1;
        this.loadItems();
    }

    clearSearch() {
        this.searchClicked = false;
        if (!this.itemData.Search)
            this.loadItems();
    }

    customFilter() {
        if (!this.queryCustomFilter) {
            this.queryCustomFilter = true;
            setTimeout(() => this.queryCustomFilter = false, 500);
            if (this.customFilters && this.customFilters.length > 0) {
                let items: FilterData[] = _.cloneDeep(this.itemData.Filters || []);
                this.customFilters.forEach((obj: ObjectEx) => {
                    let value = this.objFilter && this.objFilter[obj.property],
                        compareType = obj['CompareType'] || CompareType.S_Contains;
                    switch (obj.dataType) {
                        case DataType.Number: compareType = obj['CompareType'] || CompareType.N_Equals; break;
                        case DataType.Boolean: compareType = obj['CompareType'] || CompareType.B_Equals; break;
                        case DataType.String: compareType = obj['CompareType'] || CompareType.S_Contains; break;
                        case DataType.DropDown: {
                            if (typeof value == 'string') {
                                compareType = obj['CompareType'] || CompareType.S_Equals;
                                if (value) value = value.trim();
                            } else if (Array.isArray(value)) {
                                compareType = obj['CompareType'] || CompareType.S_Contains;
                            } else compareType = obj['CompareType'] || CompareType.N_Equals;
                        } break;
                        case DataType.DateTime: compareType = obj['CompareType'] || CompareType.D_Between; break;
                    }

                    let index = items.findIndex(c => c.Name == obj.property);
                    if (value) {
                        let itemFilter = obj.dataType == DataType.DropDown
                            ? { Value: value, Name: obj.property, Compare: compareType }
                            : Array.isArray(value)
                                ? { Value: value[0], Value2: value[1], Name: obj.property, Compare: compareType }
                                : { Value: value, Name: obj.property, Compare: compareType };
                        if (index >= 0) items[index] = itemFilter;
                        else items.push(itemFilter);
                    } else if (index >= 0) items.splice(index, 1);
                });
                this.searchClicked = true;
                if (!this.itemData.Paging)
                    this.itemData.Paging = new PagingData();
                this.itemData.Paging.Index = 1;
                this.filters(items);
            }
        }
    }

    inlineFilter() {
        if (this.inlineFilters && this.inlineFilters.length > 0) {
            let items: FilterData[] = _.cloneDeep(this.itemData.Filters || []);
            this.inlineFilters.forEach((obj: ObjectEx) => {
                let value = this.objFilter && this.objFilter[obj.property],
                    compareType = obj['CompareType'] || CompareType.S_Contains;
                switch (obj.dataType) {
                    case DataType.Number: compareType = obj['CompareType'] || CompareType.N_Equals; break;
                    case DataType.Boolean: compareType = obj['CompareType'] || CompareType.B_Equals; break;
                    case DataType.String: compareType = obj['CompareType'] || CompareType.S_Contains; break;
                    case DataType.DropDown: {
                        if (typeof value == 'string') {
                            compareType = obj['CompareType'] || CompareType.S_Equals;
                            if (value) value = value.trim();
                        } else if (Array.isArray(value)) {
                            compareType = obj['CompareType'] || CompareType.S_Contains;
                        } else compareType = obj['CompareType'] || CompareType.N_Equals;
                    } break;
                    case DataType.DateTime: compareType = obj['CompareType'] || CompareType.D_Between; break;
                }

                let index = items.findIndex(c => c.Name == obj.property);
                if (value) {
                    let itemFilter = obj.dataType == DataType.DropDown
                        ? { Value: value, Name: obj.property, Compare: compareType }
                        : Array.isArray(value)
                            ? { Value: value[0], Value2: value[1], Name: obj.property, Compare: compareType }
                            : { Value: value, Name: obj.property, Compare: compareType };
                    if (index >= 0) items[index] = itemFilter;
                    else items.push(itemFilter);
                } else if (index >= 0) items.splice(index, 1);
            });
            if (!this.itemData.Paging)
                this.itemData.Paging = new PagingData();
            this.itemData.Paging.Index = 1;
            this.filters(items);
        }
    }

    checkAllChange() {
        this.items.forEach((item: BaseEntity) => {
            item.Checked = item.Checkable ? this.checkAll : false;
            this.addToChecked(item);
        });

        let count = this.originalItems.filter(c => c.Checked).length;
        this.eventCheckChange(count);
    }

    async loadItems() {
        if (!this.searchClicked) this.itemData.Search = null;
        if (this.obj && this.obj.Reference) {
            this.loading = true;
            this.checkAll = false;
            if (this.obj.IgnoreIds) this.itemData.IgnoreIds = this.obj.IgnoreIds;
            await this.service.items(this.itemData, this.obj.Url).then((result: ResultApi) => {
                if (result && result.Type == ResultType.Success) {
                    if (result.ObjectExtra)
                        this.itemData = result.ObjectExtra as TableData || new TableData();
                    this.renderItems(result.Object);
                    this.itemTotal = result.Total;
                    this.storeItemData();
                } else {
                    ToastrHelper.ErrorResult(result);
                    this.message = result && result.Description;
                }
                this.loading = false;
            }, () => {
                this.loading = false;
                this.message = MessageHelper.SystemWrong;
            });
        }
    }

    onSearchBoxBlur() {
        if (this.itemData.Search) {
            this.itemData.Search = this.itemData.Search.trim();
        }
    }

    autoCustomFilter() {
        if (this.obj.DisableAutoLoad)
            return;
        this.customFilter();
    }

    clickClearSearch() {
        this.itemData.Search = '';
        this.clearStorage();
        this.clearSearch();
    }

    delete(id: number) {
        if (this.obj && this.obj.Reference) {
            this.dialogService.Confirm('Do you want delete this data?', () => {
                this.service.delete(this.obj.ReferenceName, id).then((result: ResultApi) => {
                    if (result && result.Type == ResultType.Success) {
                        this.loadItems();
                    } else ToastrHelper.ErrorResult(result);
                });
            });
        }
    }

    choiceColumnChange() {
        this.renderResize();
        this.activeProperties = this.properties.filter(c => c.Active);
        this.renderActiveTotalProperties();
    }

    clearCustomFilter() {
        this.customFilters.forEach((item: ObjectEx) => {
            this.objFilter[item.property] = null;
        });
        this.objFilter = EntityHelper.createEntity(this.obj.Reference);
        this.itemData.Orders = null;
        this.itemData.Search = '';
        if (this.properties) {
            this.properties.forEach((item: PropertyData) => {
                item.Order = null;
            });
        }
        this.customFilter();
    }

    renderCustomFilter() {
        let customFilters: ObjectEx[] = [];
        if (this.obj.CustomFilters && this.obj.CustomFilters.length > 0) {
            this.objFilter = EntityHelper.createEntity(this.obj.Reference);
            let properties = DecoratorHelper.decoratorProperties(this.obj.Reference, false);
            if (properties && properties.length > 0) {
                this.obj.CustomFilters.forEach((item: any) => {
                    if (typeof item == 'string') {
                        let name = item;
                        let property = properties.find(c => c.property == name);
                        if (property) customFilters.push(property);
                    } else {
                        let name = item.Name;
                        let property = properties.find(c => c.property == name);
                        if (property) {
                            property['CompareType'] = item.Type;
                            customFilters.push(property);
                        }
                    }
                });
            }
        } else {
            this.objFilter = EntityHelper.createEntity(this.obj.Reference);
            let properties = DecoratorHelper.decoratorProperties(this.obj.Reference, false);
            if (properties && properties.length > 0) {
                properties = _.cloneDeep(properties);
                customFilters = properties.filter(c => c.allowSearch);
            }
        }
        if (this.itemData && this.itemData.Filters) {
            this.itemData.Filters.forEach((item: FilterData) => {
                if (item.Name != 'Active' && item.Name != 'Deleted') {
                    if (item.Value2) this.objFilter[item.Name] = [item.Value, item.Value2];
                    else this.objFilter[item.Name] = item.Value;
                    this.activeCustomFilter = true;
                }
            });
        }

        if (customFilters && customFilters.length > 0) {
            customFilters.forEach((item: ObjectEx) => {
                if (item.dataType == DataType.DateTime) {
                    (<DateTimeEx>item).type = DateTimeType.DateRange;
                }
            });
        }
        let length = customFilters && customFilters.length > 0
            ? 4 - customFilters.length % 4 - 1
            : 0;
        for (let i = 0; i < length; i++) {
            if (!this.filterLength)
                this.filterLength = [];
            this.filterLength.push(i);
        }
        this.customFilters = customFilters;
    }

    renderInlineFilter() {
        if (this.obj.InlineFilters && this.obj.InlineFilters.length > 0) {
            this.objFilter = EntityHelper.createEntity(this.obj.Reference);
            let properties = DecoratorHelper.decoratorProperties(this.obj.Reference, false);
            if (properties && properties.length > 0) {
                this.inlineFilters = [];
                this.obj.InlineFilters.forEach((item: any) => {
                    if (typeof item == 'string') {
                        let name = item;
                        let property = properties.find(c => c.property == name);
                        if (property) this.inlineFilters.push(property);
                    } else {
                        let name = item.Name;
                        let property = properties.find(c => c.property == name);
                        if (property) {
                            property['CompareType'] = item.Type;
                            this.inlineFilters.push(property);
                        }
                    }
                });
            }
        }
    }

    view(item: BaseEntity) {
        this.prepareForm = true;
        setTimeout(() => {
            this.dialogService.Dialog({
                object: item.Id,
                objectExtra: this.obj,
                cancelFunction: () => {
                    this.prepareForm = false;
                },
                okFunction: () => {
                    this.loadItems();
                    this.prepareForm = false;
                },
                type: DialogType.AdminView,
            });
        }, 300);
    }

    edit(item: BaseEntity) {
        this.prepareForm = true;
        setTimeout(() => {
            this.dialogService.Dialog({
                object: item.Id,
                objectExtra: this.obj,
                cancelFunction: () => {
                    this.prepareForm = false;
                },
                okFunction: () => {
                    this.loadItems();
                    this.prepareForm = false;
                },
                type: DialogType.AdminEdit,
            });
        }, 300);
    }

    renderItems(items: any) {
        try {
            this.items = items;
            this.cloneItems = _.cloneDeep(items);
            this.originalItems = _.cloneDeep(items);
            if (this.items && this.items.length > 0) {
                let item = this.items[0],
                    properties = Object.keys(item),
                    ignoreProperties = ['CreatedDate', 'UpdatedDate', 'CreatedBy', 'UpdatedBy', 'Active', 'Deleted'];
                if (!this.properties) {
                    this.properties = [];
                    properties.forEach((propertyItem: string) => {
                        if (ignoreProperties.indexOf(propertyItem) >= 0)
                            return;
                        if (propertyItem != 'Id' && propertyItem.endsWith('Id')) {
                            let propertyId = propertyItem.substring(0, propertyItem.length - 2);
                            if (properties.indexOf(propertyId) >= 0)
                                return;
                        }
                        let property = DecoratorHelper.decoratorProperty(this.obj.Reference, propertyItem) ||
                            DecoratorHelper.decoratorProperty(this.obj.Reference, propertyItem + 'Id'),
                            title = UtilityExHelper.createLabel(propertyItem),
                            align = 'left';
                        if (property) {
                            title = UtilityExHelper.createLabel(property.label || propertyItem);
                            align = property.dataType == DataType.DateTime
                                ? 'center'
                                : (property.dataType == DataType.Boolean
                                    ? ((<BooleanEx>property).lookup ? 'left' : 'center')
                                    : property.dataType == DataType.Number && property.property != 'Id'
                                        ? 'right'
                                        : 'left');
                        }
                        this.properties.push({
                            Title: title,
                            Align: align,
                            Property: propertyItem,
                            TabFilterType: TabFilterType.Basic,
                            AllowFilter: property?.allowFilter,
                            Type: property ? property.dataType : DataType.String,
                        });
                    });
                }

                // add active properties
                let decoratorProperties = DecoratorHelper.decoratorProperties(this.obj.Reference, false);
                if (!this.objFilter) this.objFilter = EntityHelper.createEntity(this.obj.Reference);
                this.properties.forEach((propertyItem: PropertyData) => {
                    if (!propertyItem.Title)
                        propertyItem.Title = UtilityExHelper.createLabel(propertyItem.Property);
                    if (propertyItem.Active == null)
                        propertyItem.Active = true;
                    if (propertyItem.AllowFilterInline) {
                        if (decoratorProperties && decoratorProperties.length > 0) {
                            decoratorProperties.forEach((item: ObjectEx) => {
                                if (item.property == propertyItem.Property) {
                                    propertyItem.ColumnFilter = item;
                                }
                            });
                        }
                    }
                });

                // render
                this.items.forEach((item: BaseEntity) => {
                    this.properties.forEach((propertyItem: PropertyData) => {
                        if (item.Checkable == null) item.Checkable = (!propertyItem.HideCheckbox || !propertyItem.HideCheckbox(item));
                        if (propertyItem.Format) {
                            item[propertyItem.Property] = propertyItem.Format(item);
                        } else {
                            let property = DecoratorHelper.decoratorProperty(this.obj.Reference, propertyItem.Property) ||
                                DecoratorHelper.decoratorProperty(this.obj.Reference, propertyItem.Property + 'Id');
                            if (property) {
                                if (property.dataType == DataType.DropDown) {
                                    let propertyDropDown = <DropDownEx>property;
                                    if (propertyDropDown.lookup && propertyDropDown.lookup.items) {
                                        let optionItem = propertyDropDown.lookup.items.find(c => c.value == item[propertyDropDown.property]);
                                        if (optionItem) {
                                            item[propertyDropDown.property + '_Color'] = optionItem.color;
                                            item[propertyDropDown.property] = UtilityExHelper.createLabel(optionItem.label);
                                        }
                                    }
                                } else if (property.dataType == DataType.Boolean) {
                                    let propertyBoolean = <BooleanEx>property;
                                    if (propertyBoolean.lookup && propertyBoolean.lookup.items) {
                                        let values = item[propertyBoolean.property] && JSON.parse(item[propertyBoolean.property]) as any[];
                                        if (Array.isArray(values)) {
                                            if (values && values.length > 0) {
                                                let valueString: string = '';
                                                values.forEach((value: any) => {
                                                    let optionItem = propertyBoolean.lookup.items.find(c => c.value == value);
                                                    if (optionItem) {
                                                        valueString += valueString ? ', ' + optionItem.label : optionItem.label;
                                                    }
                                                    item[propertyBoolean.property + '_Text'] = valueString;
                                                });
                                            }
                                        } else {
                                            let optionItem = propertyBoolean.lookup.items.find(c => c.value == item[propertyBoolean.property]);
                                            if (optionItem) {
                                                item[propertyBoolean.property + '_Color'] = optionItem.color;
                                                item[propertyBoolean.property] = UtilityExHelper.createLabel(optionItem.label);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    });
                    item.Checked = this.selectedIds && this.selectedIds.indexOf(item.Id) >= 0;
                });
                setTimeout(() => {
                    $('.grid-content').animate({ scrollTop: 0 }, "fast");
                }, 300);
            } else {
                this.message = this.itemData && this.itemData.Search
                    ? 'Not data available for keyword: ' + this.itemData.Search
                    : 'Not data available';
            }
            this.activeProperties = this.properties.filter(c => c.Active);
            this.renderActiveTotalProperties();

            // asyn load
            if (this.obj.AsynLoad) this.obj.AsynLoad();
        } catch {
        }
    }

    trash(item: BaseEntity) {
        if (this.obj && this.obj.Reference) {
            let table = DecoratorHelper.decoratorClass(this.obj.Reference);
            this.dialogService.ConfirmAsync('Are you want <b>' + (item.Deleted ? 'restore' : 'delete') + '</b> this record?', async () => {
                await this.service.trash(this.obj.ReferenceName, item.Id).then((result: ResultApi) => {
                    if (result && result.Type == ResultType.Success) {
                        ToastrHelper.Success((item.Deleted ? 'Restore ' : 'Delete ') + this.obj.Title.toLowerCase() + ' success');
                        this.loadItems();
                    } else ToastrHelper.ErrorResult(result);
                });
            });
        }
    }

    active(item: BaseEntity) {
        if (this.obj && this.obj.Reference) {
            let table = DecoratorHelper.decoratorClass(this.obj.Reference);
            this.dialogService.ConfirmAsync('Are you want <b>' + (item.Active ? 'de-active' : 'active') + '</b> this record?', async () => {
                await this.service.active(this.obj.ReferenceName, item.Id).then((result: ResultApi) => {
                    if (result && result.Type == ResultType.Success) {
                        ToastrHelper.Success((item.Deleted ? 'De-Active ' : 'Active ') + this.obj.Title.toLowerCase() + ' success');
                        this.loadItems();
                    } else ToastrHelper.ErrorResult(result);
                });
            });
        }
    }

    public closeFilterMenu() {
        if (this.properties && this.properties.length > 0) {
            this.properties.forEach((item: PropertyData) => {
                item.ActiveFilter = false;
            });
        }
    }

    onSearchBoxKeypress(e: any) {
        let input = e.target,
            val = input.value,
            end = input.selectionEnd;
        if (e.keyCode == 32 && (val[end - 1] == " " || val[end] == " ")) {
            return false;
        }
    }
    
    public readFile(files: any) {
        
    }

    public selectedFile(event: any) {
        let files = event.srcElement.files;
        if (files && files.length > 0) {
            this.readFile(files);
        }
    }

    sort(property: PropertyData) {
        if (this.obj && this.obj.Reference) {
            if (!this.itemData) this.itemData = new TableData();
            if (!this.itemData.Orders) this.itemData.Orders = [];
            if (!this.itemData.Paging) this.itemData.Paging = new PagingData();
            let order = this.itemData.Orders.find(c => c.Name == property.Property);
            let orderType = order && order.Type && order.Type == OrderType.Asc
                ? OrderType.Desc
                : OrderType.Asc;
            this.itemData.Orders = [{
                Type: orderType,
                Name: property.Property,
            }];
            this.itemData.Paging.Index = 1;
            this.properties.forEach((property: PropertyData) => {
                property.Order = null;
            });
            property.Order = orderType;
            this.loadItems();
        }
    }

    setFilter(items: FilterData[]) {
        this.itemData.Filters = items;
    }

    setOrder(items: SortingData[]) {
        this.itemData.Orders = items;
    }

    setPageSize(size: number = 20) {
        if (!this.itemData.Paging)
            this.itemData.Paging = new PagingData();
        this.itemData.Paging.Size = size;
    }

    pageChanged(page: PagingData) {
        if (!this.itemData) this.itemData = new TableData();
        this.itemData.Paging = page;
        this.loadItems();
    }

    rowDoubleClick(item: BaseEntity) {
        //this.view(item);
    }

    toggleActiveStatisticalComponent() {
        this.activeStatisticalComponent = !this.activeStatisticalComponent;
        if (this.activeStatisticalComponent) {
            this.renderStatistical();
        }
    }

    async onScroll(item: PropertyData) {
        if (!item.LoadingFilter && item.AllowLoadMore) {
            item.PageIndex += 1;
            await this.loadItemFilter(item);
        }
    }

    clearSignleCustomeFilter(value: any) {
        if (!value) this.customFilter();
    }

    columlClick(e: any, item: BaseEntity) {
        let routerLink = e.target.attributes.routerlink || e.target.parentElement.attributes.routerlink;
        if (routerLink && routerLink.value) {
            let type = e.target.attributes.type || e.target.parentElement.attributes.type;
            if (routerLink.value.indexOf('quickView') >= 0) this.quickView(item, type && type.value);
            else if (routerLink.value.indexOf('view') >= 0) this.view(item);
            else if (routerLink.value.indexOf('copy') >= 0) {
                e.target.parentElement.attributes.tooltip.value = 'Copied';
                UtilityExHelper.copyString(e.target.parentElement.attributes.data.value);
            }
        }
    }

    filterChoiceColumn(item: PropertyData) {
        return item.Active;
    }

    checkChange(evt: any, item: BaseEntity) {
        console.log('xxxxxxxxxxx');
        item.Checked = evt.target.checked;
        this.addToChecked(item);

        let count = this.originalItems.filter(c => c.Checked).length;
        this.eventCheckChange(count);
    }

    quickView(item: BaseEntity, type: string) {

    }

    filters(items?: FilterData | FilterData[]) {
        if (!this.itemData) this.itemData = new TableData();
        this.itemData.Filters = items && Array.isArray(items)
            ? items as FilterData[]
            : items ? [items as FilterData] : null;
        this.loadItems();
    }

    checkRadioChange(evt: any, item: BaseEntity) {
        this.items.forEach((itm: BaseEntity) => {
            itm.Checked = false;
        });
        item.Checked = evt.target.checked;
        this.addToCheckedRadio(item);

        let count = this.originalItems.filter(c => c.Checked).length;
        this.eventCheckChange(count);
    }

    viewHistory(id: number, controller?: string) {
        if (!controller) {
            controller = this.obj.ReferenceName;
        }
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            title: 'Activity log',
            object: HistoryComponent,
            size: ModalSizeType.ExtraLarge,
            objectExtra: { id: id, type: controller },
        });
    }

    async render(obj: GridData, items?: BaseEntity[]) {
        this.obj = obj;
        if (this.obj && this.obj.Reference) {
            if (!this.obj.Filters) {
                this.obj.Filters = [];
                this.obj.Filters.push({
                    name: 'Draft',
                    systemName: ActionType.Empty,
                    click: (objItem: ActionData) => {
                        this.filters({
                            Value: false,
                            Name: "Active",
                            Compare: CompareType.B_Equals
                        });
                    },
                    icon: 'kt-nav__link-icon la la-recycle',
                });
                this.obj.Filters.push({
                    name: 'Default',
                    systemName: ActionType.Empty,
                    click: (objItem: ActionData) => {
                        this.filters();
                    },
                    icon: 'kt-nav__link-icon la la-skyatlas',
                });
                this.obj.Filters.push({
                    name: 'Trash',
                    systemName: ActionType.Empty,
                    click: (objItem: ActionData) => {
                        this.filters({
                            Value: true,
                            Name: "Deleted",
                            Compare: CompareType.B_Equals
                        });
                    },
                    icon: 'kt-nav__link-icon la la-trash',
                });
            }

            if (!this.obj.ReferenceName) {
                let table = DecoratorHelper.decoratorClass(this.obj.Reference);
                this.obj.ReferenceName = table.name.toLowerCase();
            }

            let allowExport = await this.authen.permissionAllow(this.obj.ReferenceName, ActionType.Export);
            if (allowExport) {
                if (!this.obj.Exports) {
                    this.obj.Exports = [];
                    this.obj.Exports.push({
                        name: 'Excel',
                        systemName: ActionType.Export,
                        click: () => {
                            this.dialogService.WapperAsync({
                                confirmText: 'Export data',
                                title: 'Export data [Excel]',
                                object: ModalExportDataComponent,
                                objectExtra: {
                                    Data: this.itemData,
                                    Type: ExportType.Excel,
                                    Reference: this.obj.Reference,
                                }
                            });
                        },
                        icon: 'kt-nav__link-icon la la-file-excel-o',
                    });
                    this.obj.Exports.push({
                        name: 'CSV',
                        systemName: ActionType.Export,
                        click: () => {
                            this.dialogService.WapperAsync({
                                title: 'Export data [CSV]',
                                confirmText: 'Export data',
                                object: ModalExportDataComponent,
                                objectExtra: {
                                    Data: this.itemData,
                                    Type: ExportType.Csv,
                                    Reference: this.obj.Reference,
                                }
                            });
                        },
                        icon: 'kt-nav__link-icon la la-file-text-o',
                    });
                    this.obj.Exports.push({
                        name: 'PDF',
                        systemName: ActionType.Export,
                        click: () => {
                            this.dialogService.WapperAsync({
                                title: 'Export data [PDF]',
                                confirmText: 'Export data',
                                object: ModalExportDataComponent,
                                objectExtra: {
                                    Data: this.itemData,
                                    Type: ExportType.Pdf,
                                    Reference: this.obj.Reference,
                                }
                            });
                        },
                        icon: 'kt-nav__link-icon la la-file-pdf-o',
                    });
                }
            }

            let allowImport = await this.authen.permissionAllow(this.obj.ReferenceName, ActionType.Import);
            if (allowImport) {
                if (!this.obj.Imports) {
                    this.obj.Imports = [];
                    this.obj.Imports.push({
                        name: 'Excel',
                        systemName: ActionType.Import,
                        click: () => {

                        },
                        icon: 'kt-nav__link-icon la la-file-excel-o',
                    });
                    this.obj.Imports.push({
                        name: 'CSV',
                        systemName: ActionType.Import,
                        click: () => {

                        },
                        icon: 'kt-nav__link-icon la la-file-text-o',
                    });
                }
            }

            if (!this.obj.Actions) {
                this.obj.Actions = [];
                let allowEdit = await this.authen.permissionAllow(this.obj.ReferenceName, ActionType.Edit);
                if (allowEdit) {
                    this.obj.Actions.push(ActionData.edit((item: any) => {
                        this.edit(item);
                    }));
                }
                let allowView = await this.authen.permissionAllow(this.obj.ReferenceName, ActionType.View);
                if (allowView) {
                    this.obj.Actions.push(ActionData.view((item: any) => {
                        this.view(item);
                    }));
                }
                // let allowPublish = await this.authen.permissionAllow(this.obj.ReferenceName, ActionType.Publish);
                // if (allowPublish) {
                //     this.obj.Actions.push(ActionData.active((item: any) => {
                //         this.active(item);
                //     }));
                // }
                let allowDelete = await this.authen.permissionAllow(this.obj.ReferenceName, ActionType.Delete);
                if (allowDelete) {
                    this.obj.Actions.push(ActionData.delete((item: any) => {
                        this.trash(item);
                    }));
                }
            } else {
                this.obj.Actions.forEach(async (item: ActionData) => {
                    let controller = item.controllerName || this.obj.ReferenceName;
                    let allow = await this.authen.permissionAllow(controller, item.systemName);
                    if (!allow) {
                        this.obj.Actions = this.obj.Actions.filter(c => c.name.toLowerCase() != item.name.toLowerCase());
                    }
                });
                let allowView = await this.authen.permissionAllow(this.obj.ReferenceName, ActionType.View);
                if (!allowView) {
                    this.obj.Actions = this.obj.Actions.filter(c => c.name.toLowerCase() != ActionType.View.toLowerCase());
                }
                let allowEdit = await this.authen.permissionAllow(this.obj.ReferenceName, ActionType.Edit);
                if (!allowEdit) {
                    this.obj.Actions = this.obj.Actions.filter(c => c.name.toLowerCase() != ActionType.Edit.toLowerCase());
                }
                let allowDelete = await this.authen.permissionAllow(this.obj.ReferenceName, ActionType.Delete);
                if (!allowDelete) {
                    this.obj.Actions = this.obj.Actions.filter(c => c.name.toLowerCase() != ActionType.Delete.toLowerCase());
                }
                // let allowPublish = await this.authen.permissionAllow(this.obj.ReferenceName, ActionType.Publish);
                // if (!allowPublish) {
                //     this.obj.Actions = this.obj.Actions.filter(c => c.name.toLowerCase() != ActionType.Publish.toLowerCase());
                // }
            }

            if (!this.obj.Features) {
                this.obj.Features = [];
                let allowAdd = await this.authen.permissionAllow(this.obj.ReferenceName, ActionType.AddNew);
                if (allowAdd) {
                    this.obj.Features.push(ActionData.addNew(() => {
                        this.addNew();
                    }));
                }
                this.obj.Features.push(ActionData.reload(() => {
                    this.loadItems();
                }));
            } else {
                let allowAdd = await this.authen.permissionAllow(this.obj.ReferenceName, ActionType.AddNew);
                if (!allowAdd) {
                    this.obj.Features = this.obj.Features.filter(c => c.name.toLowerCase() != ActionType.AddNew.toLowerCase())
                }
            }

            if (this.obj.MoreActions) {
                let actions = _.cloneDeep(this.obj.MoreActions);
                this.obj.MoreActions = await this.authen.actionsAllow(this.obj.Reference, actions);
            }

            if (this.obj.MoreFeatures && this.obj.MoreFeatures.Actions) {
                let actions = _.cloneDeep(this.obj.MoreFeatures.Actions);
                this.obj.MoreFeatures.Actions = await this.authen.actionsAllow(this.obj.Reference, actions);
            }

            if (this.obj.UpdatedBy == null)
                this.obj.UpdatedBy = true;

            this.itemData = this.loadItemData();
            if (this.itemData.Search)
                this.searchClicked = true;
            this.itemData.Name = this.obj.ReferenceName;
            if (this.obj) {
                if (!this.obj.Title) {
                    let table = DecoratorHelper.decoratorClass(this.obj.Reference);
                    this.obj.Title = table.title;
                }
                if (!this.obj.Size) this.obj.Size = ModalSizeType.Default;
            }

            if (!items) await this.loadItems();
            else this.renderItems(items);
            this.renderCustomFilter();
            this.renderInlineFilter();
            this.renderResize();
            this.renderEmbed();
        }
    }

    public async toggleFilterMenu(property: PropertyData) {
        let active = !property.ActiveFilter;
        this.closeFilterMenu();
        property.ActiveFilter = active;
        if (!property.ItemFilters || property.ItemFilters.length == 0) {
            property.PageIndex = 1;
            property.ItemFilters = [];
            property.AllowLoadMore = true;
            property.LoadingFilter = false;
            property.ItemFiltersSearch = null;
            if (property.ActiveFilter) {
                this.loadItemFilter(property);
            }
        }
    }

    async itemFilterSearchChange(text: string, item: PropertyData) {
        this.itemFilterSearchChanged.next(text);
        if (!this.subItemFilterSearchChanged) {
            this.subItemFilterSearchChanged = this.itemFilterSearchChanged.pipe(
                debounceTime(500),
                distinctUntilChanged()
            ).subscribe(async (text: string) => {
                if (!item.LoadingFilter) {
                    item.PageIndex = 1;
                    item.ItemFilters = [];
                    item.AllowLoadMore = true;
                    item.ItemFiltersSearch = text;
                    await this.loadItemFilter(item, false);
                    item.LoadingFilter = false;
                }
            });
        }
    }

    public activeTabFilterMenu(property: PropertyData, type: TabFilterType) {
        property.TabFilterType = type;
    }

    private renderEmbed() {
        if (this.obj.EmbedComponent) {
            setTimeout(() => {
                if (this.componentEmbedInstance) {
                    if (this.containerEmbed) {
                        this.containerEmbed.remove();
                        this.componentEmbedRef.destroy();
                    }
                    this.componentEmbedInstance = null;
                }
                let component = this.componentFactoryResolver.resolveComponentFactory(this.obj.EmbedComponent);
                this.componentEmbedRef = this.containerEmbed.createComponent(component);
                this.componentEmbedInstance = <any>this.componentEmbedRef.instance;
                this.componentEmbedInstance.params = { TableData: this.itemData };
                this.componentEmbedRef.changeDetectorRef.detectChanges();
            }, 300);
        }
    }
    private clearStorage() {
        let stateKey = 'params',
            controller = this.getController(),
            sessionKey = 'session_' + stateKey + '_' + controller;
        sessionStorage.removeItem(sessionKey);
    }
    private renderResize() {
        setTimeout(() => {
            let $handle: any,
                $column: any,
                startX: number,
                pressed = false,
                startWidth: number;
            $(document).on({
                mouseup: () => {
                    if (pressed) {
                        $column.removeClass('resizing');
                        pressed = false;
                    }
                },
                mousemove: (event: any) => {
                    if (pressed) {
                        $column.width(startWidth + (event.pageX - startX));
                    }
                },
            }).on('mousedown', '.table-resizable th .handle-resize', function (event: any) {
                $handle = $(this);
                $column = $handle.closest('th').addClass('resizing');
                startWidth = $column.width();
                startX = event.pageX;
                pressed = true;
            });
        }, 300);
    }
    private loadItemData() {
        if (this.obj.IsPopup)
            this.obj.NotKeepPrevData = true;
        if (!this.obj.NotKeepPrevData) {
            let dataKey = this.obj.ReferenceKey || this.obj.ReferenceName;
            let item = localStorage.getItem('data_' + dataKey);
            if (item) return JSON.parse(item) as TableData;
        }
        return this.itemData || new TableData();
    }
    private storeItemData() {
        if (this.obj.IsPopup)
            this.obj.NotKeepPrevData = true;
        if (!this.obj.NotKeepPrevData) {
            let dataKey = this.obj.ReferenceKey || this.obj.ReferenceName;
            localStorage.setItem('data_' + dataKey, JSON.stringify(this.itemData));
        }
    }
    private getController() {
        let url = this.router.url
            .replace('/admin/', '')
            .replace('admin/', '');
        let items = url.split('/');
        return items && items[0];
    }
    private renderStatistical() {
        if (this.obj.StatisticalComponent && this.activeStatisticalComponent) {
            setTimeout(() => {
                if (this.componentInstance) {
                    if (this.container) {
                        this.container.remove();
                        this.componentRef.destroy();
                    }
                    this.componentInstance = null;
                }
                let component = this.componentFactoryResolver.resolveComponentFactory(this.obj.StatisticalComponent);
                this.componentRef = this.container.createComponent(component);
                this.componentInstance = <any>this.componentRef.instance;
                this.componentRef.changeDetectorRef.detectChanges();
            }, 300);
        }
    }
    eventCheckChange(count: number) {

    }
    private renderActiveTotalProperties() {
        this.activeTotalProperties = this.activeProperties.filter(c => c.SumOrCount);
        if (this.activeTotalProperties && this.activeTotalProperties.length > 0) {
            this.totalItem = new BaseEntity();
            let firstProperty = this.activeTotalProperties[0];
            this.activeTotalProperties.forEach((property: PropertyData) => {
                if (property.SumOrCount) this.totalItem[property.Property] = property.SumOrCount();
                else this.totalItem[property.Property] = this.items.reduce((sum, current) => sum + current[property.Property], 0);
            });
            this.mergeCount = this.activeProperties.findIndex(c => c.Property == firstProperty.Property);
            this.notMergeCount = this.activeProperties.length - this.activeTotalProperties.length - this.mergeCount;
            if (this.obj.UpdatedBy) this.notMergeCount += 1;
            if (this.obj.Actions) this.notMergeCount += 1;
        }
    }
    private addToChecked(item: BaseEntity) {
        if (!this.selectedIds) this.selectedIds = [];
        if (item.Checkable) {
            if (item.Checked) {
                if (this.selectedIds.indexOf(item.Id) < 0)
                    this.selectedIds.push(item.Id);
            } else {
                this.checkAll = false;
                if (this.selectedIds.indexOf(item.Id) >= 0)
                    this.selectedIds = this.selectedIds.filter(c => c != item.Id);
            }
        }

        // set checked for orignalItem
        this.originalItems.forEach((item: BaseEntity) => {
            item.Checked = this.selectedIds.indexOf(item.Id) >= 0;
        });
    }
    private getUrlState(): NavigationStateData {
        let stateKey = 'params',
            controller = this.getController(),
            navigation = this.router.getCurrentNavigation(),
            sessionKey = 'session_' + stateKey + '_' + controller,
            valueJson = navigation && navigation.extras && navigation.extras.state
                ? navigation.extras.state[stateKey]
                : sessionStorage.getItem(sessionKey);
        if (valueJson) sessionStorage.setItem(sessionKey, valueJson.toString());
        return JSON.parse(valueJson) as NavigationStateData;
    }
    private addToCheckedRadio(item: BaseEntity) {
        this.selectedIds = [];
        if (item.Checkable) {
            if (item.Checked) {
                this.selectedIds.push(item.Id);
            }
        }

        // set checked for orignalItem
        this.originalItems.forEach((item: BaseEntity) => {
            item.Checked = this.selectedIds.indexOf(item.Id) >= 0;
        });
    }
    private async loadItemFilter(property: PropertyData, append: boolean = true) {
        property.LoadingFilter = true;
        if (!property.PageSize) property.PageSize = 20;
        if (!property.PageIndex) property.PageIndex = 1;
        let decorator = DecoratorHelper.decoratorProperty(this.obj.Reference, property.Property) ||
            DecoratorHelper.decoratorProperty(this.obj.Reference, property.Property + 'Id');
        if (decorator) {
            switch (decorator.dataType) {
                case DataType.String: {
                    let objEx = <StringEx>decorator,
                        columns: any[] = [objEx.property];
                    let items = await this.service.lookup('/' + this.obj.ReferenceName + '/lookup', columns, null, false, property.ItemFiltersSearch, property.PageIndex, property.PageSize).then((result: ResultApi) => {
                        return OptionItem.createOptionItemsFromObject(result.Object as any[], objEx.property);
                    });
                    this.cloneItems = _.cloneDeep(this.items);
                    if (items && items.length > 0) {
                        if (items.length < property.PageSize) property.AllowLoadMore = false;
                        if (append) {
                            items.forEach(itm => {
                                property.ItemFilters.push(itm);
                            });
                        } else property.ItemFilters = items;
                    } else property.AllowLoadMore = false;
                } break;
                case DataType.DateTime: {
                    let objEx = <DateTimeEx>decorator,
                        columns: any[] = [objEx.property];
                    let items = await this.service.lookupDateTime('/' + this.obj.ReferenceName + '/lookup', columns, null, null, property.PageIndex, property.PageSize).then((result: ResultApi) => {
                        let options: OptionItem[] = [];
                        let itemDates = result.Object as any[];
                        if (itemDates && itemDates.length > 0) {
                            itemDates.forEach((item: any) => {
                                let date: Date = item['Date'] as Date,
                                    dateString = UtilityExHelper.dateString(date);
                                let option: OptionItem = {
                                    value: item && date,
                                    label: item && dateString,
                                };
                                options.push(option);
                            });
                        }
                        return options;
                    });
                    this.cloneItems = _.cloneDeep(this.items);
                    if (items && items.length > 0) {
                        if (items.length < property.PageSize) property.AllowLoadMore = false;
                        if (append) {
                            items.forEach(itm => {
                                property.ItemFilters.push(itm);
                            });
                        } else property.ItemFilters = items;
                    } else property.AllowLoadMore = false;
                } break;
                case DataType.Number: {
                    let objEx = <NumberEx>decorator,
                        columns: any[] = [objEx.property];
                    let items = await this.service.lookup('/' + this.obj.ReferenceName + '/lookup', columns, null, false, property.ItemFiltersSearch, property.PageIndex, property.PageSize).then((result: ResultApi) => {
                        return OptionItem.createOptionItemsFromObject(result.Object as any[], objEx.property);
                    });
                    this.cloneItems = _.cloneDeep(this.items);
                    if (items && items.length > 0) {
                        if (items.length < property.PageSize) property.AllowLoadMore = false;
                        if (append) {
                            items.forEach(itm => {
                                property.ItemFilters.push(itm);
                            });
                        } else property.ItemFilters = items;
                    } else property.AllowLoadMore = false;
                } break;
                case DataType.DropDown: {
                    let objEx = <DropDownEx>decorator;
                    if (objEx.lookup && objEx.lookup.items) {
                        property.ItemFilters = objEx.lookup.items;
                    } else if (objEx.lookup.url) {
                        let columns: any[] = _.cloneDeep(objEx.lookup.propertyDisplay || ['Name']);
                        columns.unshift(objEx.lookup.propertyValue || 'Id');
                        if (objEx.lookup.propertyGroup)
                            columns.push(objEx.lookup.propertyGroup);
                        let items = await this.service.lookup(objEx.lookup.url, columns, null, false, property.ItemFiltersSearch, property.PageIndex, property.PageSize).then((result: ResultApi) => {
                            return OptionItem.createOptionItems(result, objEx);
                        });
                        this.cloneItems = _.cloneDeep(this.items);
                        if (items && items.length > 0) {
                            if (items.length < property.PageSize) property.AllowLoadMore = false;
                            if (append) {
                                items.forEach(itm => {
                                    property.ItemFilters.push(itm);
                                });
                            } else property.ItemFilters = items;
                        } else property.AllowLoadMore = false;
                    }
                } break;
                case DataType.Boolean: {
                    let objEx = <BooleanEx>decorator;
                    if (objEx.lookup && objEx.lookup.items) {
                        property.ItemFilters = objEx.lookup.items;
                    } else if (objEx.lookup.url) {
                        let columns: any[] = _.cloneDeep(objEx.lookup.propertyDisplay || ['Name']);
                        columns.unshift(objEx.lookup.propertyValue || 'Id');
                        if (objEx.lookup.propertyGroup)
                            columns.push(objEx.lookup.propertyGroup);
                        let items = await this.service.lookup(objEx.lookup.url, columns, null, false, property.ItemFiltersSearch, property.PageIndex, property.PageSize).then((result: ResultApi) => {
                            return OptionItem.createOptionItems(result, objEx);
                        });
                        this.cloneItems = _.cloneDeep(this.items);
                        if (items && items.length > 0) {
                            if (items.length < property.PageSize) property.AllowLoadMore = false;
                            if (append) {
                                items.forEach(itm => {
                                    property.ItemFilters.push(itm);
                                });
                            } else property.ItemFilters = items;
                        } else property.AllowLoadMore = false;
                    } else {
                        property.ItemFilters = OptionItem.createOptionItemsFromBoolean();
                    }
                } break;
            }
        }
        setTimeout(() => {
            property.LoadingFilter = false;
        }, 1000);
    }
}