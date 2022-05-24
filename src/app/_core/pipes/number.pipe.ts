import { formatNumber } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'numberx',
})
export class NumberPipe implements PipeTransform {
    transform(
        value: number,
        digitsInfo: string = '1.0-2',
        locale: string = 'en',
    ): string | null {
        if (!value) value = 0;
        return value.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
    }
}