declare var $;
import * as _ from 'lodash';
import { NumberType } from '../../domains/enums/data.type';
import { OptionItem } from '../../domains/data/option.item';
import { NumberEx } from '../../decorators/number.decorator';
import { UtilityExHelper } from '../../helpers/utility.helper';
import { DropDownEx } from '../../decorators/dropdown.decorator';
import { AdminApiService } from '../../services/admin.api.service';
import { AdminEventService } from '../../services/admin.event.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'editor-numberic',
    templateUrl: 'numberic.component.html',
    styleUrls: ['numberic.component.scss']
})
export class NumbericComponent implements OnInit {
    type: string;
    @Input() value: any;
    @Input() items: OptionItem[];
    @Input() decorator: NumberEx;
    @Output() valueChange = new EventEmitter<string>();
    keys: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'Delete', 'Alt', 'Home', 'End', 'Tab', 'ArrowLeft', 'ArrowRight'];

    constructor(
        public event: AdminEventService,
        public service: AdminApiService) {
    }

    async ngOnInit() {
        this.type = 'text';
        if (!this.decorator)
            this.decorator = new DropDownEx();
        if (!this.decorator.min) this.decorator.min = 0;
        this.decorator.id = UtilityExHelper.randomText(8);
        if (!this.decorator.step) this.decorator.step = 1;
        if (!this.decorator.max) this.decorator.max = 1000000;
        if (!this.decorator.decimals) this.decorator.decimals = 0;
        if (!this.decorator.placeholder) this.decorator.placeholder = '';
        await this.render();
    }

    private async render() {
        if (!this.decorator.readonly) {
            if (this.decorator.type == NumberType.Numberic) {
                setTimeout(() => {
                    let $numberic = $("#" + this.decorator.id);
                    if ($numberic && $numberic.length > 0) {
                        $numberic.TouchSpin({
                            min: this.decorator.min,
                            max: this.decorator.max,
                            step: this.decorator.step,
                            postfix: this.decorator.unit,
                            decimals: this.decorator.decimals,
                            initval: this.value || this.decorator.min,
                        }).on('touchspin.on.stopspin', (e: any) => {
                            this.value = $numberic.val();
                            this.valueChange.emit(this.value);
                        });
                    }
                }, 300);
            } else if (this.decorator.type == NumberType.Text) {

            }
        }
    }

    inputChange() {
        if (this.decorator.max && this.value) {
            try {
                let value = parseFloat(this.value);                
                if (isNaN(value)) {
                    $('#' + this.decorator.id).val('');
                    this.value = null;
                    return;
                }
                if (value > this.decorator.max) {
                    this.value = this.decorator.max;
                    $('#' + this.decorator.id).val(this.value);
                }
            } catch {
                this.value = this.decorator.min || 0;
                $('#' + this.decorator.id).val(this.value);
            }
        }
        this.valueChange.emit(this.value);
    }

    onNumberBlur() {
        if (this.decorator.max && this.value) {
            try {
                let value = parseFloat(this.value);
                if (isNaN(value)) {
                    $('#' + this.decorator.id).val('');
                    this.value = null;
                    return;
                }
                if (value > this.decorator.max) {
                    this.value = this.decorator.max;
                    this.valueChange.emit(this.value);
                    $('#' + this.decorator.id).val(this.value);
                } 
            } catch {
                this.value = this.decorator.min || 0;
                $('#' + this.decorator.id).val(this.value);
            }
        }
    }

    onNumberKeypress(e: any) {
        let key = e.key,
            val = e.target.value;
        if (e.ctrlKey && (key == 'c' || key == 'a'))
            return true;
        if (!this.decorator.decimals) {
            if (!val && key == '0') {
                if (!this.decorator.allowZero) return false;
            }
        }
        if (this.keys.indexOf(key) < 0) return false;
        return true;
    }
}
