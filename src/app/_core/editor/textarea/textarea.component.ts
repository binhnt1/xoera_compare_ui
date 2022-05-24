import * as _ from 'lodash';
import { StringType } from '../../domains/enums/data.type';
import { StringEx } from '../../decorators/string.decorator';
import { UtilityExHelper } from '../../helpers/utility.helper';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'editor-textarea',
    templateUrl: 'textarea.component.html',
    styleUrls: ['textarea.component.scss']
})
export class TextAreaComponent {
    StringType = StringType;
    @Input() value: string;
    @Input() decorator: StringEx;
    @Output() valueChange = new EventEmitter<string>();

    constructor() {
    }

    ngOnInit() {
        if (!this.decorator) 
            this.decorator = new StringEx();
        if (!this.decorator.min) this.decorator.min = 0;
        this.decorator.id = UtilityExHelper.randomText(8);
        if (!this.decorator.max) this.decorator.max = 250;
        if (!this.decorator.placeholder) this.decorator.placeholder = '';
        if (!this.decorator.type) this.decorator.type = StringType.MultiText;
    }

    clear() {
        this.value = '';
        this.valueChange.emit(this.value);
    }

    inputChange() {
        if (this.value) {
            while (this.value.indexOf('  ') >= 0)
                this.value = this.value.replace('  ', ' ');
        }
        this.valueChange.emit(this.value);
    }

    onGenerate() {
        if (this.decorator.type == StringType.AutoGenerate) {
            let max = this.decorator.max || 10,
                value = UtilityExHelper.randomText(max);
            this.value = value;
            this.valueChange.emit(this.value);
        }
    }
}
