import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-pagination',
    standalone: true,  // Add this to ensure it's a standalone component
    template: `
        <button (click)="onPrevious()" [disabled]="currentPage === 1">Previous</button>
        <input type="number" [value]="currentPage" (change)="onPageInputChange($event)" [min]="1" [max]="totalPages" />
        <button (click)="onNext()" [disabled]="currentPage === totalPages">Next</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
    `
})
class PaginationComponent {
    @Input() currentPage: number = 1;
    @Input() pageSize: number = 1;
    @Input() totalItems: number = 0;
    @Output() pageChange = new EventEmitter<number>();

    get totalPages(): number {
        return Math.ceil(this.totalItems / this.pageSize);
    }

    onPrevious() {
        if (this.currentPage > 1) {
            this.pageChange.emit(this.currentPage - 1);
        }
    }

    onNext() {
        if (this.currentPage < this.totalPages) {
            this.pageChange.emit(this.currentPage + 1);
        }
    }

    onPageInputChange(event: Event) {
        const input = event.target as HTMLInputElement;
        let page = Number(input.value);
        if (page >= 1 && page <= this.totalPages) {
            this.pageChange.emit(page);
        } else {
            input.value = this.currentPage.toString(); // Reset to current page if out of range
        }
    }
}

export { PaginationComponent };
