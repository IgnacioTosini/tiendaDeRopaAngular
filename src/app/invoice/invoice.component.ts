import { Component, Input } from '@angular/core';
import { Tax } from '../models/tax.model';
import { TaxService } from '../services/tax.service';
import { FormGroup } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss'
})
export class InvoiceComponent {
  @Input() invoices: Tax[] = [];
  @Input() userForm: FormGroup = new FormGroup({});

  constructor(private taxService: TaxService, private userService: UserService) { }

  verFacturaPorId(): void {
    this.taxService.findByCode(this.userForm?.get('invoiceCode')?.value).subscribe(
      data => {
        console.log(data);
        this.invoices = [data];
      },
      error => {
        console.error(error);
      }
    );
  }

  verTodasLasFacturas(): void {
    this.taxService.findAllTaxUser(this.userService.getUserId()).subscribe(
      data => {
        console.log(data);
        this.invoices = data;
      },
      error => {
        console.error(error);
      }
    );
  }

  /* startPaymentProcess(): void {
    const mp = new MercadoPago('YOUR_ACCESS_TOKEN', {
      locale: 'es-AR'
    });

    const preference = {
      items: this.invoices.map(invoice => ({
        title: `Factura ${invoice.getId()}`,
        unit_price: invoice.getPrice(),
        quantity: 1,
      })),
    };

    mp.preferences.create(preference)
      .then(response => {
        window.open(response.body.init_point, '_blank');
      })
      .catch(error => {
        console.error(error);
      });
  } */
}
