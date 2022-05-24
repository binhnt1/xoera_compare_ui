import "reflect-metadata";
import * as _ from "lodash";
import { FileData } from "../domains/data/file.data";
import { LookupData } from "../domains/data/lookup.data";
import { NumberEx } from "../decorators/number.decorator";
import { ObjectEx } from "../decorators/object.decorator";
import { StringEx } from "../decorators/string.decorator";
import { Subscription } from "rxjs/internal/Subscription";
import { AddressData } from "../domains/data/address.data";
import { BooleanEx } from "../decorators/boolean.decorator";
import { UtilityExHelper } from "../helpers/utility.helper";
import { DropDownEx } from "../decorators/dropdown.decorator";
import { DateTimeEx } from "../decorators/datetime.decorator";
import { DecoratorHelper } from "../helpers/decorator.helper";
import { AdminApiService } from "../services/admin.api.service";
import { AdminEventService } from "../services/admin.event.service";
import { UploadFileComponent } from "./upload.file/upload.file.component";
import { UploadImageComponent } from "./upload.image/upload.image.component";
import { BooleanType, DataType, DateTimeType, NumberType, StringType } from "../domains/enums/data.type";
import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef, ViewChild, OnChanges } from "@angular/core";

@Component({
    selector: 'editor',
    styleUrls: ['./editor.component.scss'],
    templateUrl: './editor.component.html',
})
export class EditorComponent implements OnInit, OnChanges {
    DataType = DataType;
    StringType = StringType;
    BooleanType = BooleanType;
    DateTimeType = DateTimeType;

    subscribeValidation: Subscription;
    textType: StringType = StringType.Text;
    address: AddressData = new AddressData();
    boolType: BooleanType = BooleanType.Checkbox;
    @ViewChild('uploadFile') file: UploadFileComponent;
    @ViewChild('uploadImage') image: UploadImageComponent;

    @Input() object: any;
    @Input() html: boolean;
    @Input() viewer: boolean;
    @Input() property: string;
    @Input() readonly: boolean;
    @Input() decorator: ObjectEx;
    @Input() labelInline: boolean;
    @Output('objectChange') objectChange = new EventEmitter();
    @Output('valueChange') valueChange = new EventEmitter<any>();

    constructor(
        public cd: ChangeDetectorRef,
        public event: AdminEventService,
        public service: AdminApiService) {

    }

    ngOnInit() {
        let decorator: ObjectEx
        if (this.property.indexOf('.') >= 0) {
            let className = this.property.split('.')[0],
                propertyName = this.property.split('.')[1],
                tempDecorator = DecoratorHelper.decoratorProperty(className, propertyName);
            decorator = _.cloneDeep(tempDecorator || new ObjectEx());
        } else {
            let propertyName = this.property,
                className = this.object.constructor.name,
                tempDecorator = DecoratorHelper.decoratorProperty(className, propertyName);
            decorator = _.cloneDeep(tempDecorator || new ObjectEx());
        }
        if (this.decorator) {
            if (this.decorator.id) decorator.id = this.decorator.id;
            if (this.decorator.icon) decorator.icon = this.decorator.icon;
            if (this.decorator.label != null) decorator.label = this.decorator.label;
            if (this.decorator.dataType) decorator.dataType = this.decorator.dataType;
            if (this.decorator.readonly) decorator.readonly = this.decorator.readonly;
            if (this.decorator.allowClear) decorator.allowClear = this.decorator.allowClear;
            if (this.decorator.required != null) decorator.required = this.decorator.required;
            if (this.decorator.placeholder) decorator.placeholder = this.decorator.placeholder;
            if (this.decorator.description != null) decorator.description = this.decorator.description;
            switch (decorator.dataType) {
                case DataType.Number: {
                    let temp = <NumberEx>this.decorator;

                    // Set default value
                    if (!(<NumberEx>decorator).type) (<NumberEx>decorator).type = NumberType.Numberic;

                    // Set other value
                    if (temp.min) (<NumberEx>decorator).min = temp.min || 0;
                    if (temp.step) (<NumberEx>decorator).step = temp.step || 1;
                    if (temp.max) (<NumberEx>decorator).max = temp.max || 10000;
                    if (temp.unit) (<NumberEx>decorator).unit = temp.unit || '';
                    if (temp.decimals) (<NumberEx>decorator).decimals = temp.decimals;
                    if (temp.type) (<NumberEx>decorator).type = temp.type || NumberType.Numberic;
                }
                    break;
                case DataType.String: {
                    let temp = <StringEx>this.decorator;
                    // Set default value
                    if (!(<StringEx>decorator).type) (<StringEx>decorator).type = StringType.Text;

                    // Set other value
                    if (temp.min) (<StringEx>decorator).min = temp.min || 0;
                    if (temp.max) (<StringEx>decorator).max = temp.max || 250;
                    if (temp.rows) (<StringEx>decorator).rows = temp.rows || 3;
                    if (temp.type) (<StringEx>decorator).type = temp.type || StringType.Text;
                }
                    break;
                case DataType.Boolean: {
                    let temp = <BooleanEx>this.decorator;
                    if (temp.description) (<BooleanEx>decorator).description = temp.description || '';
                }
                    break;
                case DataType.DateTime: {
                    let temp = <DateTimeEx>this.decorator;
                    let now = new Date(),
                        day = now.getDate(),
                        month = now.getMonth() + 1,
                        year = now.getFullYear() + 100,
                        maxDate = new Date(year, month, day);
                    // Set default value
                    if (!(<DateTimeEx>decorator).type) (<DateTimeEx>decorator).type = DateTimeType.Date;

                    // Set other value
                    if (temp.format) (<DateTimeEx>decorator).format = temp.format;
                    if (temp.max) (<DateTimeEx>decorator).max = temp.max || maxDate;
                    if (temp.type) (<DateTimeEx>decorator).type = temp.type || DateTimeType.Date;
                    if (temp.min) (<DateTimeEx>decorator).min = temp.min || new Date(1900, 1, 1, 0, 0, 0, 0);
                }
                    break;
                case DataType.DropDown: {
                    let temp = <DropDownEx>this.decorator;

                    // Set default value
                    if (temp.multiple != null) (<DropDownEx>decorator).multiple = temp.multiple;
                    if (!(<DropDownEx>decorator).lookup) (<DropDownEx>decorator).lookup = new LookupData();
                    if (temp.lookup && temp.lookup.url) (<DropDownEx>decorator).lookup.url = temp.lookup.url;
                    if (temp.lookup && temp.lookup.items) (<DropDownEx>decorator).lookup.items = temp.lookup.items;
                    if (temp.autoSelect == true || temp.autoSelect == false) (<DropDownEx>decorator).autoSelect = temp.autoSelect;
                }
                    break;
            }
        }
        this.decorator = _.cloneDeep(decorator || this.decorator);
        this.decorator.error = null;

        switch (this.decorator.dataType) {
            case DataType.String: this.textType = (<StringEx>this.decorator).type; break;
            case DataType.Boolean: this.boolType = (<BooleanEx>this.decorator).type; break;
        }

        // address data
        if (this.object && 
            this.decorator.dataType == DataType.String && 
            (<StringEx>this.decorator).type == StringType.Address) {
            this.address = {
                lat: this.object['Lat'],
                lng: this.object['Lng'],
                address: this.object[this.property],
            };
        }

        // subscribe validate
        if (!this.subscribeValidation) {
            this.subscribeValidation = this.event.Validate.subscribe((item: ObjectEx) => {
                if (item.error &&
                    item.target == this.decorator.target &&
                    item.property == this.decorator.property) {
                    this.decorator.error = item.error;
                    this.cd.detectChanges();
                }
            })
        }
    }

    ngOnChanges() {
        this.renderItem();
        if (this.decorator) {
            if (this.readonly == true || this.readonly == false)
                this.decorator.readonly = this.readonly;
        }
    }

    public valueChanged(value: any) {
        this.decorator.error = null;
        this.valueChange.emit(value);
    }

    public addressChange(value: AddressData) {
        this.address = value;
        this.decorator.error = null;
        this.object['Lat'] = value && value.lat;
        this.object['Lng'] = value && value.lng;
        this.valueChange.emit(value && value.address);
        this.object[this.property] = value && value.address;
    }

    public async upload(): Promise<FileData[]> {
        if (this.file) return await this.file.upload();
        else if (this.image) return await this.image.upload();
        return null;
    }

    private renderItem() {
        if (this.viewer && this.decorator) {
            if (this.decorator.dataType == DataType.DropDown) {
                let propertyDropDown = <DropDownEx>this.decorator;
                if (propertyDropDown.lookup && propertyDropDown.lookup.items) {
                    let optionItem = propertyDropDown.lookup.items.find(c => c.value == this.object[propertyDropDown.property]);
                    if (optionItem) {
                        this.object[propertyDropDown.property + '_Color'] = optionItem.color;
                        this.object[propertyDropDown.property] = UtilityExHelper.createLabel(optionItem.label);
                    }
                }
            } else if (this.decorator.dataType == DataType.Boolean) {
                let propertyBoolean = <BooleanEx>this.decorator;
                if (propertyBoolean.lookup && propertyBoolean.lookup.items) {
                    this.decorator.dataType = DataType.String;
                    let values = this.object[propertyBoolean.property] && JSON.parse(this.object[propertyBoolean.property]) as any[];
                    if (Array.isArray(values)) {
                        if (values && values.length > 0) {
                            let valueString: string = '';
                            values.forEach((value: any) => {
                                let optionItem = propertyBoolean.lookup.items.find(c => c.value == value);
                                if (optionItem) {
                                    valueString += valueString ? ', ' + optionItem.label : optionItem.label;
                                }
                                this.object[propertyBoolean.property] = valueString;
                            });
                        }
                    } else {
                        let optionItem = propertyBoolean.lookup.items.find(c => c.value == this.object[propertyBoolean.property]);
                        if (optionItem) {
                            this.object[propertyBoolean.property + '_Color'] = optionItem.color;
                            this.object[propertyBoolean.property] = UtilityExHelper.createLabel(optionItem.label);
                        }
                    }
                }
            }
        }
    }
}
