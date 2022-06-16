import * as _ from 'lodash';
import Tagify from '@yaireo/tagify';
import { StringType } from '../../domains/enums/data.type';
import { StringEx } from '../../decorators/string.decorator';
import { UtilityExHelper } from '../../helpers/utility.helper';
import { ValidatorHelper } from '../../helpers/validator.helper';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'editor-textbox',
    templateUrl: 'textbox.component.html',
    styleUrls: ['textbox.component.scss']
})
export class TextBoxComponent {
    type: string;
    tags: string[] = [];
    StringType = StringType;
    keys: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'Delete', 'Alt', 'Home', 'End', 'Tab', 'ArrowLeft', 'ArrowRight'];

    @Input() value: string;
    @Input() decorator: StringEx;
    @Output() onBlur = new EventEmitter<string>();
    @Output() clearValue = new EventEmitter<string>();
    @Output() valueChange = new EventEmitter<string>();
    @Output() keyPressEnter = new EventEmitter<string>();

    constructor() {
    }

    ngOnInit() {
        if (!this.decorator)
            this.decorator = new StringEx();
        if (!this.decorator.min) this.decorator.min = 0;
        if (!this.decorator.max) this.decorator.max = 250;
        if (!this.decorator.type) this.decorator.type = StringType.Text;
        if (!this.decorator.placeholder) this.decorator.placeholder = '';
        if (!this.decorator.id) this.decorator.id = UtilityExHelper.randomText(8);
        switch (this.decorator.type) {
            case StringType.Link: this.type = 'url'; break;
            case StringType.Email: this.type = 'text'; break;
            case StringType.Search: this.type = 'search'; break;
            case StringType.PhoneText: this.type = 'tel'; break;
            case StringType.Password: this.type = 'password'; break;
            default: this.type = 'text'; break;
        }
        if (this.decorator.type == StringType.Tag) {
            setTimeout(() => {
                this.renderTagify();
            }, 500);
        }
    }

    clear() {
        this.value = '';
        this.valueChange.emit(this.value);
        setTimeout(() => { this.clearValue.emit() }, 300);
    }

    inputChange() {
        this.valueChange.emit(this.value);
    }

    onGenerate() {
        if (this.decorator.generateFunction) {
            let value = this.decorator.generateFunction();
            this.value = value;
            this.valueChange.emit(this.value);
        } else if (this.decorator.type == StringType.AutoGenerate) {
            let max = this.decorator.max || 10,
                value = UtilityExHelper.randomText(max);
            this.value = value;
            this.valueChange.emit(this.value);
        }
    }
    onTextBoxBlur() {
        try {
            if (this.value) {
                if (this.decorator.type == StringType.PhoneText) {
                    if (!this.decorator.readonly) {
                        if (this.value.indexOf('0') != 0) {
                            this.value = '';
                            this.valueChange.emit(this.value);
                        } else {
                            let valid = ValidatorHelper.validPhone(this.value);
                            if (!valid) {
                                this.value = '';
                                this.valueChange.emit(this.value);
                            }
                        }
                    }
                } else {
                    let temp = this.value;
                    this.value = this.value.trim();
                    while (this.value.indexOf('  ') >= 0)
                        this.value = this.value.replace('  ', ' ');
                    if (temp != this.value) this.valueChange.emit(this.value);
                }
            }
            this.onBlur.emit(this.value);
        } catch { }
    }
    onPhoneKeypress(e: any) {
        try {
            if (e.key == 'Enter') this.keyPressEnter.emit();
            let key = e.key,
                val = e.target.value;
            if (e.ctrlKey && (key == 'v' || key == 'c' || key == 'a'))
                return true;
            if (!val) if (key != '0') return false;
            if (this.keys.indexOf(key) < 0) return false;
            return true;
        } catch {
            return false;
        }
    }
    onTextBoxKeypress(e: any) {
        try {
            if (e.key == 'Enter') this.keyPressEnter.emit();
            if (this.decorator.type == StringType.Email && e.key == '+')
                return false;
        } catch { }
    }

    private renderTagify() {
        var input = document.getElementById(this.decorator.id);
        if (input) {
            let tagify = new Tagify(input);
            if (this.value) {
                let array = this.value.split(',');
                tagify.addTags(array);
            }
            tagify.on('add', e => {
                let value = e.detail.data.value.trim();
                if (this.tags.indexOf(value) < 0) {
                    this.tags.push(value);
                }
                this.value = this.tags && this.tags.length > 0
                    ? this.tags.join(',')
                    : null;
                this.valueChange.emit(this.value);
            });
            tagify.on('remove', e => {
                let value = e.detail.data.value.trim();
                if (this.tags.indexOf(value) >= 0) {
                    this.tags.splice(this.tags.indexOf(value), 1);
                }
                this.value = this.tags && this.tags.length > 0
                    ? this.tags.join(',')
                    : null;
                this.valueChange.emit(this.value);
            });
        }
    }
}
