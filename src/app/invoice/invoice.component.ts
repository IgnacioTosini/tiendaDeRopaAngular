import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Tax } from '../models/tax.model';
import { TaxService } from '../services/tax.service';
import { UserService } from '../services/user.service';
import { ToastNotificationComponent } from '../toast-notification/toast-notification.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { Pagination } from '../models/pagination.model';
import { NotificationService } from '../services/notification.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [FormsModule, ToastNotificationComponent, PaginationComponent],
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  @Input() invoices: Tax[] = [];
  invoiceCode: string = '';
  invoiceDate: Date = new Date();
  showNotification: boolean = false;
  typeOfNotification: boolean = false;
  notificationMessage: string = '';
  pagination: Pagination | null = null;
  currentPage: number = 0;

  constructor(
    private taxService: TaxService,
    private userService: UserService,
    public notificationService: NotificationService,
    private meta: Meta,
    private title: Title
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Invoice Management - Your Store');
    this.meta.addTags([
      { name: 'description', content: 'Manage your invoices efficiently with our invoice management system.' },
      { name: 'keywords', content: 'invoices, invoice management, tax, store, online store' },
      { name: 'author', content: 'Your Store' }
    ]);
  }

  private handleNotification(message: string, isSuccess: boolean): void {
    this.notificationService.handleNotification(message, isSuccess);
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
