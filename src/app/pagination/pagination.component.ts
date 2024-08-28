import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() pageIndex: number = 0;
  @Input() pageSize: number = 0;
  @Input() totalItems: number = 0;

  @Output() previousPage = new EventEmitter<void>();
  @Output() nextPage = new EventEmitter<void>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  onPreviousPage() {
    if (this.pageIndex > 0) {
      this.previousPage.emit();
    }
  }

  onNextPage() {
    if ((this.pageIndex + 1) * this.pageSize < this.totalItems) {
      this.nextPage.emit();
    }
  }
}
