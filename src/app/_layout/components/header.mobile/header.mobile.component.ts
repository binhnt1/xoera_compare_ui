declare var $: any
import { Component } from '@angular/core';
import { DataService } from '../../../_core/services/data.service';

@Component({
    selector: 'layout-client-header-mobile',
    templateUrl: 'header.mobile.component.html'
})
export class LayoutHeaderMobileComponent {
    constructor(public data: DataService) {

    }

    toggleMenuAside() {
        setTimeout(() => {
            this.data.activeMenuAside = !this.data.activeMenuAside;
        }, 100);
    }

    toggleMenuHeader() {
        setTimeout(() => {
            this.data.activeMenuHeader = !this.data.activeMenuHeader;
        }, 100);
    }

    toggleMenuUser() {
        document.getElementsByTagName('body')[0].classList.toggle("kt-header__topbar--mobile-on");
    }
}
