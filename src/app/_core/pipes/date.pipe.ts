import { DatePipe } from '@angular/common';
import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'datex',
})
export class DateExPipe extends DatePipe implements PipeTransform {
    constructor(@Inject(LOCALE_ID) locale: string) {
        super(locale);
    }

    transform(value: any, format: string = 'dd/MM/yyyy', timezone?: string, locale?: string): string {
        return super.transform(value, format, timezone, locale);
    }
}