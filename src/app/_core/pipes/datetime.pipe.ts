import { DatePipe } from '@angular/common';
import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'datetimex',
})
export class DateTimePipe extends DatePipe implements PipeTransform {
    constructor(@Inject(LOCALE_ID) locale: string) {
        super(locale);
    }

    transform(value: any, format: string = 'dd/MM/yyyy HH:mm', timezone?: string, locale?: string): string {
        return super.transform(value, format, timezone, locale);
    }
}