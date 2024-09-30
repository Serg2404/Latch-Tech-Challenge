import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview PaginationComponent is a reusable Angular component that provides
 * pagination controls for navigating through a list of items.
 * 
 * @component
 * @selector app-pagination
 * @standalone true
 * @imports CommonModule
 * 
 * @description
 * This component includes buttons for navigating to the previous and next pages,
 * an input for directly entering a page number, and a select dropdown for changing
 * the page size. It also displays the current page, total pages, and the range of
 * items being shown.
 * 
 * @inputs
 * - `currentPage: number` - The current page number (default: 1).
 * - `pageSize: number` - The number of items per page (default: 1).
 * - `totalItems: number` - The total number of items.
 * - `pageSizeOptions: number[]` - The available page size options (default: [5, 10, 20, 50]).
 * 
 * @outputs
 * - `pageChange: EventEmitter<number>` - Emits the new page number when the page changes.
 * - `pageSizeChange: EventEmitter<number>` - Emits the new page size when the page size changes.
 * 
 * @methods
 * - `get totalPages(): number` - Calculates the total number of pages.
 * - `get startItem(): number` - Calculates the index of the first item on the current page.
 * - `get endItem(): number` - Calculates the index of the last item on the current page.
 * - `onPrevious()` - Navigates to the previous page if not on the first page.
 * - `onNext()` - Navigates to the next page if not on the last page.
 * - `onPageInputChange(event: Event)` - Handles changes to the page number input.
 * - `onPageSizeChange(event: Event)` - Handles changes to the page size select dropdown.
 */
@Component({
    selector: 'app-pagination',
    standalone: true,
    imports: [CommonModule],  // Import CommonModule here
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss']
})
class PaginationComponent {
    @Input() currentPage: number = 1;
    @Input() pageSize: number = 1;
    @Input() totalItems: number = 0;
    @Input() pageSizeOptions: number[] = [5, 10, 20, 50]; // Default page size options
    @Output() pageChange = new EventEmitter<number>();
    @Output() pageSizeChange = new EventEmitter<number>();

    /**
     * Gets the total number of pages based on the total number of items and the page size.
     * 
     * @returns {number} The total number of pages.
     */
    get totalPages(): number {
        return Math.ceil(this.totalItems / this.pageSize);
    }

    /**
     * Gets the index of the first item on the current page.
     * 
     * @returns The index of the first item, calculated based on the current page and page size.
     */
    get startItem(): number {
        return (this.currentPage - 1) * this.pageSize + 1;
    }

    /**
     * Gets the index of the last item on the current page.
     * 
     * @returns {number} The index of the last item on the current page, 
     * which is the smaller value between the total number of items and 
     * the product of the current page number and the page size.
     */
    get endItem(): number {
        return Math.min(this.currentPage * this.pageSize, this.totalItems);
    }

    /**
     * Navigates to the previous page if the current page is greater than 1.
     * Emits the page change event with the new page number.
     */
    onPrevious() {
        if (this.currentPage > 1) {
            this.pageChange.emit(this.currentPage - 1);
        }
    }

    /**
     * Advances to the next page if the current page is less than the total number of pages.
     * Emits the new page number through the `pageChange` event emitter.
     */
    onNext() {
        if (this.currentPage < this.totalPages) {
            this.pageChange.emit(this.currentPage + 1);
        }
    }

    /**
     * Handles the change event for the page input field.
     * 
     * This method is triggered when the user changes the value in the page input field.
     * It validates the input to ensure it is within the valid page range. If the input
     * is valid, it emits the new page number. If the input is invalid, it resets the 
     * input field to the current page number.
     * 
     * @param event - The input change event.
     */
    onPageInputChange(event: Event) {
        const input = event.target as HTMLInputElement;
        let page = Number(input.value);
        if (page >= 1 && page <= this.totalPages) {
            this.pageChange.emit(page);
        } else {
            input.value = this.currentPage.toString(); // Reset to current page if out of range
        }
    }

    /**
     * Handles the change in page size from a select element.
     * 
     * @param event - The event triggered by changing the select element's value.
     * 
     * This method updates the `pageSize` property with the new size, emits the 
     * `pageSizeChange` event with the new size, and resets the current page to the 
     * first page by emitting the `pageChange` event with a value of 1.
     */
    onPageSizeChange(event: Event) {
        const select = event.target as HTMLSelectElement;
        const newSize = Number(select.value);
        this.pageSize = newSize;
        this.pageSizeChange.emit(newSize);
        this.pageChange.emit(1); // Reset to the first page when page size changes
    }

    /**
     * Gets the next pages based on the current page.
     * 
     * @param count - The number of pages to retrieve after the current page.
     * @returns {number[]} An array of the next page numbers.
     */
    getNextPages(count: number = 5): number[] {
        const nextPages: number[] = [];
        for (let i = 1; i <= count; i++) {
            const nextPage = this.currentPage + i;
            if (nextPage <= this.totalPages) {
                nextPages.push(nextPage);
            } else {
                break;
            }
        }
        return nextPages;
    }

    /**
     * Gets the previous pages based on the current page, excluding the first page.
     * 
     * @param count - The number of pages to retrieve before the current page.
     * @returns {number[]} An array of the previous page numbers, excluding the first page.
     */
    getPreviousPages(count: number = 5): number[] {
        const previousPages: number[] = [];
        for (let i = 1; i <= count; i++) {
            const previousPage = this.currentPage - i;
            if (previousPage > 1) { // Exclude the first page
                previousPages.push(previousPage);
            } else {
                break;
            }
        }
        return previousPages.reverse();
    }


    /**
     * Navigates to a specific page.
     * 
     * @param page - The page number to navigate to.
     * 
     * This method validates the page number to ensure it is within the valid range.
     * If the page number is valid, it emits the `pageChange` event with the new page number.
     */
    goToPage(page: number) {
        if (page >= 1 && page <= this.totalPages) {
            this.pageChange.emit(page);
        }
    }
}

export { PaginationComponent };
