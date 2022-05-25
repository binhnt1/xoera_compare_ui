declare var $;
declare var require;
import * as _ from 'lodash';
import * as moment from 'moment';
import { OptionItem } from '../../domains/data/option.item';
import { DateTimeType } from '../../domains/enums/data.type';
import { UtilityExHelper } from '../../helpers/utility.helper';
import { DateTimeEx, DateTimeFormat } from '../../decorators/datetime.decorator';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
    selector: 'editor-datetime',
    templateUrl: 'datetime.component.html',
    styleUrls: ['datetime.component.scss']
})
export class DateTimeComponent implements OnInit, OnChanges, OnDestroy {
    type: string;
    airDatepicker: any;
    @Input() value: any;
    notCheckChange: boolean;
    @Input() items: OptionItem[];
    @Input() decorator: DateTimeEx;
    @Output() valueChange = new EventEmitter<string>();

    constructor() {
    }

    ngOnInit() {
        if (!this.decorator)
            this.decorator = new DateTimeEx();
        this.decorator.id = UtilityExHelper.randomText(8);
        if (!this.decorator.placeholder) this.decorator.placeholder = '';
        if (!this.decorator.type) this.decorator.type = DateTimeType.Date;
        if (!this.decorator.format) this.decorator.format = DateTimeFormat.DMY;
        if (!this.decorator.readonly) this.render();
        else this.setValueReadOnly();
    }

    ngOnChanges(changes: any) {
        if (changes) {
            if (changes.value) {
                if (this.decorator.type != DateTimeType.DateRange) {
                    if (!this.decorator.multiple) {
                        let prev = UtilityExHelper.dateTimeString(changes.value.previousValue);
                        let current = UtilityExHelper.dateTimeString(changes.value.currentValue);
                        if (current != prev) {
                            if (!this.decorator.readonly) this.setValue();
                            else this.setValueReadOnly();
                        }
                    } else {
                        if (!this.notCheckChange) {
                            let currentValues = changes.value.currentValue && changes.value.currentValue.length,
                                previousValues = changes.value.previousValue && changes.value.previousValue.length;
                            if (currentValues != previousValues) {
                                this.setValue(changes.value.currentValue && changes.value.currentValue);
                            }
                        }
                    }
                } else {
                    let prev1 = UtilityExHelper.dateTimeString(changes.value.previousValue && changes.value.previousValue[0]);
                    let prev2 = UtilityExHelper.dateTimeString(changes.value.previousValue && changes.value.previousValue[1]);
                    let current1 = UtilityExHelper.dateTimeString(changes.value.currentValue && changes.value.currentValue[0]);
                    let current2 = UtilityExHelper.dateTimeString(changes.value.currentValue && changes.value.currentValue[1]);
                    if (current1 != prev1 && current2 != prev2) {
                        if (!this.decorator.readonly) this.setValue();
                        else this.setValueReadOnly();
                    }
                }
            }
        }
    }

    ngOnDestroy() {
        if (this.decorator.type == DateTimeType.Date ||
            this.decorator.type == DateTimeType.DateTime) {
            let $datetime = $("#" + this.decorator.id);
            if ($datetime &&
                $datetime.length > 0 &&
                $datetime.data('datepicker')) {
                $datetime.data('datepicker').destroy();
            }
        }
    }

    clear() {
        if (this.decorator.type == DateTimeType.DateRange) {
            let $datetime = $('#' + this.decorator.id);
            if ($datetime && $datetime.length > 0) {
                this.value = undefined;
                this.valueChange.emit(this.value);
            }
        } else {
            let $datetime = $('#' + this.decorator.id);
            if ($datetime && $datetime.length > 0) {
                let item = $datetime.datepicker().data('datepicker');
                if (item) {
                    item.clear();
                    this.value = null;
                    this.valueChange.emit(this.value);
                }
            }
        }
    }

    inputChange() {
        this.valueChange.emit(this.value);
    }

    private render() {
        setTimeout(() => {
            let $datetime = $('#' + this.decorator.id);
            if (this.decorator.type == DateTimeType.DateRange) {
                let dateFormat = this.decorator.format
                    .replace(DateTimeFormat.HM, '')
                    .toUpperCase()
                    .trim();
                let timePicker = this.decorator.format.indexOf(DateTimeFormat.HM) >= 0,
                    minDate: Date = this.decorator.minCurent ? new Date() : new Date(this.decorator.min),
                    maxDate: Date = this.decorator.maxCurent ? new Date() : new Date(this.decorator.max);
                $datetime.daterangepicker({
                    ranges: {
                        'Today': [moment(), moment()],
                        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                        '7 days ago': [moment().subtract(6, 'days'), moment()],
                        '30 days ago': [moment().subtract(29, 'days'), moment()],
                        'This month': [moment().startOf('month'), moment().endOf('month')],
                        'Last month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                    },
                    locale: {
                        firstDay: 1,
                        toLabel: "To",
                        weekLabel: "W",
                        fromLabel: "From",
                        separator: " - ",
                        format: dateFormat,
                        applyLabel: "Apply",
                        cancelLabel: "Cancel",
                        customRangeLabel: "Other options",
                    },
                    minDate: minDate,
                    maxDate: maxDate,
                    showWeekNumbers: true,
                    autoUpdateInput: false,
                    timePicker: timePicker,
                    alwaysShowCalendars: true,
                    showCustomRangeLabel: false,
                    timePicker24Hour: timePicker,
                    timePickerSeconds: timePicker,
                }).on('apply.daterangepicker', (ev: any, picker: any) => {
                    this.value = [picker.startDate.toDate(), picker.endDate.toDate()];
                    let start = picker.startDate.format(dateFormat);
                    let end = picker.endDate.format(dateFormat);
                    $datetime.val(start + ' - ' + end);
                    this.valueChange.emit(this.value);
                }).on('cancel.daterangepicker', (ev: any, picker: any) => {
                    $datetime.data('daterangepicker').setStartDate(new Date());
                    $datetime.data('daterangepicker').setEndDate(new Date());
                    this.clear();
                });
                if (this.value) this.setValue();
                $datetime.attr('readonly', 'readonly');
            } else {
                require('../../../../assets/plugins/datetime/js/datepicker.js');
                if ($datetime && $datetime.length > 0) {
                    let timeFormat = this.decorator.format
                        .replace(DateTimeFormat.DMY, '')
                        .replace(DateTimeFormat.MDY, '')
                        .replace(DateTimeFormat.YMD, '')
                        .trim(),
                        dateFormat = this.decorator.format
                            .replace(DateTimeFormat.HM, '')
                            .trim(),
                        minDate: Date = this.decorator.minCurent ? new Date() : new Date(this.decorator.min),
                        maxDate: Date = this.decorator.maxCurent ? new Date() : new Date(this.decorator.max),
                        timePicker = this.decorator.type == DateTimeType.DateTime || this.decorator.type == DateTimeType.Time;
                    if (!this.airDatepicker) {
                        this.airDatepicker = $datetime.datepicker({
                            language: 'en',
                            minDate: minDate,
                            maxDate: maxDate,
                            toggleSelected: false,
                            autoClose: !timePicker,
                            timepicker: timePicker,
                            timeFormat: timeFormat,
                            dateFormat: dateFormat,
                            view: this.decorator.view,
                            inline: this.decorator.inline,
                            multipleDates: this.decorator.multiple,
                            todayButton: this.decorator.type != DateTimeType.Time,
                            onlyTimepicker: this.decorator.type == DateTimeType.Time,
                            onSelect: (formattedDate: string, date: any) => {
                                if (this.decorator.multiple) this.notCheckChange = true;
                                if (this.decorator.multiple) {
                                    this.value = date;
                                    this.valueChange.emit(this.value);
                                } else {
                                    if (this.decorator.type == DateTimeType.Time) {
                                        let datetime: Date = date,
                                            hours = datetime.getHours() < 10 ? '0' + datetime.getHours().toString() : datetime.getHours().toString(),
                                            minutes = datetime.getMinutes() < 10 ? '0' + datetime.getMinutes().toString() : datetime.getMinutes().toString();
                                        this.value = hours + ':' + minutes;
                                    } else {
                                        this.value = date;
                                    }
                                    this.valueChange.emit(this.value);
                                }
                                setTimeout(() => { this.notCheckChange = false }, 100);
                            }
                        });
                        if (this.value) this.setValue();
                        $datetime.prop('readonly', true);
                    }
                }
            }
        }, 300);
    }

    private setValueReadOnly() {
        setTimeout(() => {
            if (this.decorator.type == DateTimeType.DateRange) {
                let $datetime = $("#" + this.decorator.id);
                if ($datetime && $datetime.length > 0) {
                    let dateFormat = this.decorator.format
                        .replace(DateTimeFormat.HM, '')
                        .toUpperCase()
                        .trim();
                    let start = this.value ? moment(this.value[0]).format(dateFormat) : '',
                        end = this.value ? moment(this.value[1]).format(dateFormat) : '',
                        range = start ? start + (end ? ' - ' + end : '') : '';
                    $datetime.val(range);
                }
            } else if (this.decorator.type == DateTimeType.DateMonth) {
                let $datetime = $("#" + this.decorator.id);
                if ($datetime && $datetime.length > 0) {

                }
            } else {
                let $datetime = $("#" + this.decorator.id);
                if ($datetime && $datetime.length > 0) {
                    if (!this.decorator.multiple) {
                        if (this.decorator.type == DateTimeType.Time) {
                            if (this.value) {
                                let hours = this.value.toString().split(':')[0],
                                    minutes = this.value.toString().split(':')[1];
                                $datetime.val(hours + ':' + minutes);
                            }
                        } else {
                            if (this.value) this.value = new Date(this.value);
                            let date = this.decorator.type == DateTimeType.DateTime
                                ? UtilityExHelper.dateTimeString(this.value)
                                : UtilityExHelper.dateString(this.value);
                            $datetime.val(date);
                        }
                    }
                }
            }
        }, 300);
    }
    private setValue(values?: any) {
        if (this.decorator.type == DateTimeType.DateRange) {
            let $datetime = $("#" + this.decorator.id);
            if ($datetime && $datetime.length > 0) {
                $datetime.data('daterangepicker').setStartDate(this.value && moment(this.value[0]));
                $datetime.data('daterangepicker').setEndDate(this.value && moment(this.value[1]));

                let dateFormat = this.decorator.format
                    .replace(DateTimeFormat.HM, '')
                    .toUpperCase()
                    .trim();
                let start = this.value ? moment(this.value[0]).format(dateFormat) : '',
                    end = this.value ? moment(this.value[1]).format(dateFormat) : '',
                    range = start ? start + (end ? ' - ' + end : '') : '';
                this.valueChange.emit(this.value);
                $datetime.val(range);
            }
        } else if (this.decorator.type == DateTimeType.DateMonth) {
            let $datetime = $("#" + this.decorator.id);
            if ($datetime && $datetime.length > 0 && $datetime.data('datepicker')) {
                if (this.value) {
                    let month = parseInt(this.value.split('/')[0]) - 1,
                        year = parseInt(this.value.split('/')[1]),
                        value = new Date(year, month, 1);
                    $datetime.data('datepicker').selectDate(value);
                    this.valueChange.emit(this.value);
                } else $datetime.data('datepicker').clear();
            }
        } else {
            let $datetime = $("#" + this.decorator.id);
            if ($datetime && $datetime.length > 0 && $datetime.data('datepicker')) {
                if (!this.decorator.multiple) {
                    if (this.decorator.type == DateTimeType.Time) {
                        if (this.value) {
                            let date = new Date(),
                                hours = this.value.toString().split(':')[0],
                                minutes = this.value.toString().split(':')[1];
                            date.setHours(hours); date.setMinutes(minutes);
                            $datetime.data('datepicker').selectDate(date);
                            this.valueChange.emit(this.value);
                        }
                    } else {
                        if (this.value)
                            this.value = new Date(this.value);
                        $datetime.data('datepicker').selectDate(this.value);
                        this.valueChange.emit(this.value);
                    }
                } else {
                    $datetime.data('datepicker').clear();
                    if (!values) values = this.value;
                    if (values && values.length > 0) {
                        setTimeout(() => {
                            this.value = values || this.value;
                            $datetime.data('datepicker').selectDate(this.value);
                            if (this.value && this.value.length > 0) {
                                let month = this.monthDiff(this.value[0], this.value[this.value.length - 1]);
                                for (let i = 0; i < month; i++) {
                                    $datetime.data('datepicker').prev();
                                }
                            }
                            this.valueChange.emit(this.value);
                        });
                    } else {
                        this.value = [];
                        this.valueChange.emit(this.value);
                    }
                }
            }
        }
    }
    private monthDiff(d1: Date, d2: Date) {
        let months: number;
        months = (d2.getFullYear() - d1.getFullYear()) * 12;
        months -= d1.getMonth();
        months += d2.getMonth();
        return months <= 0 ? 0 : months;
    }
}
