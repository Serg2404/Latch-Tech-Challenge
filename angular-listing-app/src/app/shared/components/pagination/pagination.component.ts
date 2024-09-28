import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-pagination',
    standalone: true,
    imports: [CommonModule],  // Import CommonModule here
    template: `
        <button (click)="onPrevious()" [disabled]="currentPage === 1">Previous</button>
        <input type="number" [value]="currentPage" (change)="onPageInputChange($event)" [min]="1" [max]="totalPages" />
        <button (click)="onNext()" [disabled]="currentPage === totalPages">Next</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <select (change)="onPageSizeChange($event)">
            <option *ngFor="let size of pageSizeOptions" [value]="size" [selected]="size === pageSize">{{ size }}</option>
        </select>
    `
})
class PaginationComponent {
    @Input() currentPage: number = 1;
    @Input() pageSize: number = 1;
    @Input() totalItems: number = 0;
    @Input() pageSizeOptions: number[] = [5, 10, 20, 50]; // Default page size options
    @Output() pageChange = new EventEmitter<number>();
    @Output() pageSizeChange = new EventEmitter<number>();

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

    onPageSizeChange(event: Event) {
        const select = event.target as HTMLSelectElement;
        const newSize = Number(select.value);
        this.pageSize = newSize;
        this.pageSizeChange.emit(newSize);
        this.pageChange.emit(1); // Reset to the first page when page size changes
    }
}

export { PaginationComponent };
