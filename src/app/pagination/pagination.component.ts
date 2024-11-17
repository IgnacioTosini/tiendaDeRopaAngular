import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Pagination } from '../models/pagination.model';

@Component({
  selector: 'app-pagination',
  standalone: true,
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  host: {
    'role': 'navigation',
    'aria-label': 'Pagination Navigation'
  }
})
export class PaginationComponent {
  @Input() pagination: Pagination | null = null;

  @Output() previousPage = new EventEmitter<void>();
  @Output() nextPage = new EventEmitter<void>();

  onPreviousPage() {
    if (this.pagination && this.pagination.getNumber() > 0) {
      this.previousPage.emit();
    }
  }

  onNextPage() {
    if (this.pagination && !this.pagination.isLast()) {
      this.nextPage.emit();
    }
  }
}
