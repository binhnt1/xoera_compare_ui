import { PagingData } from "../../domains/data/paging.data";
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from "@angular/core";
import { OptionItem } from "../../domains/data/option.item";

@Component({
    selector: 'paging',
    styleUrls: ['./paging.component.scss'],
    templateUrl: "./paging.component.html"
})
export class PagingComponent implements OnInit, OnChanges {
    reload: boolean;
    timeReload: number;
    times: OptionItem[];
    intervalReload: any;
    counterReload: number;
    withCouterReload: number;

    to: number;
    from: number;
    page: number;
    numbers: number[];
    maxLength: number;
    @Input() text: string;
    @Input() total: number;
    @Input() sizes: number[];
    @Input() paging: PagingData;
    @Input() summaryText: string;
    @Input() allowReload: boolean;
    @Output() pagingChange: EventEmitter<PagingData> = new EventEmitter<PagingData>();

    constructor() {
        this.timeReload = 30;
    }

    ngOnChanges() {
        this.initPaging();
    }

    ngOnInit() {
        this.initPaging();
        if (!this.sizes) this.sizes = [5, 10, 20, 50, 100];
        if (!this.times) {
            this.times = [
                { value: 10, label: '10 seconds' },
                { value: 30, label: '30 seconds' },
                { value: 60, label: '01 minutes' },
                { value: 300, label: '05 minutes' },
                { value: 600, label: '10 minutes' },
            ];
        }
    }

    timeChanged() {
        this.reloadChange();
    }

    reloadChange() {
        if (this.reload) {
            this.counterReload = this.timeReload;
            if (!this.intervalReload) {
                this.intervalReload = setInterval(() => {
                    this.withCouterReload = this.counterReload >= 100 
                        ? 35 
                        : this.counterReload >= 10 ? 25 : 15;
                    this.counterReload -= 1;
                    if (this.counterReload <= 0) {
                        this.counterReload = this.timeReload;
                        this.pagingChange.emit(this.paging);
                    }
                }, 995);
            }
        } else {
            if (this.intervalReload) {
                clearInterval(this.intervalReload);
                this.intervalReload = null;
                this.counterReload = null;
            }
        }
    }

    private initPaging() {
        this.numbers = [];
        if (!this.paging) this.paging = new PagingData();
        if (!this.paging.Size)
            this.paging.Size = 10;
        if (!this.paging.Pages) {
            this.paging.Pages = Math.ceil(this.paging.Total / this.paging.Size);
        }
        this.to = this.paging.Index * this.paging.Size;
        if (this.paging.Total < this.to) {
            this.to = this.paging.Total;
        }
        this.from = this.to == 0 ? 0 : ((this.paging.Index - 1) * this.paging.Size) + 1;

        var startIndex = this.paging.Index - 3;
        if (startIndex <= 1) {
            startIndex = 1;
        }
        var endIndex = this.paging.Index + 1;
        if (endIndex <= 5) {
            endIndex = this.paging.Pages > 5 ? 5 : this.paging.Pages;
        }
        else if (endIndex > this.paging.Pages) {
            endIndex = this.paging.Pages;
        }
        if (this.paging.Index <= 3) {
            for (var i = startIndex; i <= endIndex; i++) {
                this.numbers.push(i);
            }
        } else {
            for (var i = startIndex + 1; i <= endIndex; i++) {
                this.numbers.push(i);
            }
        }
        this.page = this.paging.Index;
        this.maxLength = this.paging.Pages.toString().length;
    }

    sizeChanged(pageSize: number) {
        if (pageSize) this.paging.Size = pageSize;
        this.pagingChange.emit(this.paging);
        this.initPaging();
    }

    indexChanged(pageIndex: number) {
        if (pageIndex) this.paging.Index = pageIndex;
        this.pagingChange.emit(this.paging);
        this.page = pageIndex;
        this.initPaging();
    }

    goto() {
        if (this.page > this.paging.Pages)
            this.page = this.paging.Pages;
        if (this.page <= 0) this.page = 1;
        this.indexChanged(this.page);
    }
}
