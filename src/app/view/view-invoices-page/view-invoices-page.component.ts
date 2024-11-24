import { Component } from '@angular/core';
import { InvoiceComponent } from '../../invoice/invoice.component';

@Component({
  selector: 'app-view-invoices-page',
  standalone: true,
  imports: [InvoiceComponent],
  templateUrl: './view-invoices-page.component.html',
  styleUrls: ['./view-invoices-page.component.scss']
})
export class ViewInvoicesPageComponent {
}
