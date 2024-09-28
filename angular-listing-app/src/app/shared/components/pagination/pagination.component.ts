import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,  // Add this to ensure it's a standalone component
  template: `
    <button (click)="onPrevious()" [disabled]="currentPage === 1">Previous</button>
    <button (click)="onNext()" [disabled]="currentPage === totalPages">Next</button>
    <span>Page {{ currentPage }} of {{ totalPages }}</span>
  `
})
class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Output() pageChange = new EventEmitter<number>();

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
}

export { PaginationComponent };
