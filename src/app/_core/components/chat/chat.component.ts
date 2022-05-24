import { Component } from '@angular/core';

@Component({
    selector: 'chat',
    styleUrls: ['./chat.component.scss'],
    templateUrl: './chat.component.html',
})
export class ChatComponent {
    hide: boolean = true;

    constructor() {
    }

    hideChat() {
        this.hide = !this.hide;
    }
}
