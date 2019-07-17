import { Component, OnInit } from '@angular/core';
import { Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-custom-pagination',
    templateUrl: './custom-pagination.component.html',
    styleUrls: ['./custom-pagination.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
    // encapsulation: ViewEncapsulation.None
})
export class CustomPaginationComponent implements OnInit {
    constructor() { }


    @Input()
    get directionLinks(): boolean {
        return this._directionLinks;
    }
    set directionLinks(value: boolean) {
        this._directionLinks = !!value && <any>value !== 'false';
    }
    @Input()
    get autoHide(): boolean {
        return this._autoHide;
    }
    set autoHide(value: boolean) {
        this._autoHide = !!value && <any>value !== 'false';
    }
    @Input() listLength: number;
    @Input() filteredLength: number;
    @Input() listPerPage: number;
    @Input() itemsPerPage: number;
    @Input() id: string;
    @Input() maxSize = 5;
    @Input() previousLabel = 'Previous';
    @Input() nextLabel = 'Next';
    @Input() screenReaderPaginationLabel = 'Pagination';
    @Input() screenReaderPageLabel = 'page';
    @Input() screenReaderCurrentLabel = `You're on page`;
    @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

    private _directionLinks = true;
    private _autoHide = false;
    public totalListCount: Number = this.maxSize;
    public currentPageNo: Number;
    ngOnInit() {
        // console.log(this.listLength);

    }
    onPageChange(number: number) {
        this.currentPageNo = number;
    }
}
