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
        return value.toLocaleString("en-gb", { maximumFractionDigits: 2 });
    }
}