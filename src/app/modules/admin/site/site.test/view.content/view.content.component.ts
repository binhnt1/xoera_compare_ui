import { Component, Input, OnInit } from '@angular/core';

@Component({
    templateUrl: './view.content.component.html',
    styleUrls: ['././view.content.component.scss'],
})
export class ViewContentComponent implements OnInit  { 
    data: string;
    @Input() params: any;

    constructor() {
    }   

    ngOnInit() {
        this.data = this.params && this.params['data'];
    }
}