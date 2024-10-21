import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Tax } from '../models/tax.model';
import { TaxService } from '../services/tax.service';
import { UserService } from '../services/user.service';
import { ToastNotificationComponent } from '../toast-notification/toast-notification.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { Pagination } from '../models/pagination.model';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [FormsModule, ToastNotificationComponent, PaginationComponent],
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent {
  @Input() invoices: Tax[] = [];
  invoiceCode: string = '';
  invoiceDate: Date = new Date();
  showNotification: boolean = false;
  typeOfNotification: boolean = false;
  notificationMessage: string = '';
  pagination: Pagination | null = null;
  currentPage: number = 0;

  constructor(private taxService: TaxService, private userService: UserService) { }

  private handleNotification(message: string, isSuccess: boolean): void {
    this.notificationMessage = message;
    this.typeOfNotification = isSuccess;
    this.showNotification = true;
    setTimeout(() => {
      this.showNotification = false;
    }, 5000);
  }

  verFacturaPorId(): void {
    const invoiceCode = this.invoiceCode;
    console.log(invoiceCode);
    if (invoiceCode === '') {
      this.handleNotification('Por favor ingrese un código de factura.', false);
      return;
    }
    this.taxService.findByCode(invoiceCode, this.currentPage, 10).subscribe(
      data => {
        console.log(data);
        this.invoices = data;
        this.pagination = data.pagination;
        this.handleNotification('Factura/s encontrada/s', true);
      },
      error => {
        if (error.status === 404) {
          this.handleNotification('No se encontraron facturas con el código proporcionado.', false);
        } else {
          console.error(error);
        }
      }
    );
  }

  verTodasLasFacturas(): void {
    this.taxService.findAllTaxUser(this.userService.getUserId(), this.currentPage, 10).subscribe(
      data => {
        console.log(data);
        this.invoices = data.invoice;
        this.pagination = data.pagination;
        this.handleNotification('Factura/s encontrada/s', true);
      },
      error => {
        if (error.status === 404) {
          this.handleNotification('No se encontraron facturas para el usuario.', false);
        } else {
          console.error(error);
        }
      }
    );
  }

  verTodasLasFacturaPorDate(): void {
    if (!(this.invoiceDate instanceof Date)) {
      this.invoiceDate = new Date(this.invoiceDate);
    }

    this.taxService.findByDate(this.invoiceDate, this.currentPage, 10).subscribe(
      data => {
        console.log(data);
        this.invoices = data.invoice;
        this.pagination = data.pagination;
        this.handleNotification('Factura/s encontrada/s', true);
      },
      error => {
        if (error.status === 404) {
          this.handleNotification('No se encontraron facturas para la fecha proporcionada.', false);
        } else {
          console.error(error);
        }
      }
    );
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.verTodasLasFacturas(); // O llama a la función adecuada según el contexto
  }
}
