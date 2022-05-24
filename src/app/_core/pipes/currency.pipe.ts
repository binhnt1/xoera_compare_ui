import { Pipe, PipeTransform } from '@angular/core';
import { formatCurrency, getCurrencySymbol } from '@angular/common';

@Pipe({
    pure: false,
    name: 'currencyx',
})
export class CurrencyPipe implements PipeTransform {

    constructor() {
    }

    transform(
        value: number,
        currencyCode: string = 'USD',
        digitsInfo: string = '1.2-2',
        locale: string = 'en',
    ): string | null {
        if (!value) value = 0;
        return formatCurrency(
            value,
            locale,
            getCurrencySymbol(currencyCode, 'wide'),
            currencyCode,
            digitsInfo,
        );
    }
}