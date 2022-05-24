import { NgModule } from '@angular/core';
import { CoinPipe } from '../pipes/coin.pipe';
import { DateExPipe } from '../pipes/date.pipe';
import { NumberPipe } from '../pipes/number.pipe';
import { DateTimePipe } from '../pipes/datetime.pipe';
import { CurrencyPipe } from '../pipes/currency.pipe';
import { SanitizeUrlPipe } from '../pipes/sanitizeurl.pipe';
import { SanitizeHtmlPipe } from '../pipes/sanitizehtml.pipe';


@NgModule({
    declarations: [
        CoinPipe,
        DateExPipe,
        NumberPipe,
        DateTimePipe,
        CurrencyPipe,
        SanitizeUrlPipe,
        SanitizeHtmlPipe,
    ],
    exports: [
        CoinPipe,
        DateExPipe,
        NumberPipe,
        DateTimePipe,
        CurrencyPipe,
        SanitizeUrlPipe,
        SanitizeHtmlPipe
    ]
})
export class PipeModule { }
