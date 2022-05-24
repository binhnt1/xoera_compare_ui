import { NgModule } from '@angular/core';
import { HoverDirective } from './hover.directive';
import { WrapperDirective } from '../directives/wapper.directive';
import { ClickOutsideDirective } from './click.outside.directive';
import { ScrollTrackerDirective } from './scroll.tracker.directive';


@NgModule({
    declarations: [
        HoverDirective,
        WrapperDirective,
        ClickOutsideDirective,
        ScrollTrackerDirective,
    ],
    exports: [
        HoverDirective,
        WrapperDirective,
        ClickOutsideDirective,
        ScrollTrackerDirective,
    ]
})
export class DirectiveModule { }
