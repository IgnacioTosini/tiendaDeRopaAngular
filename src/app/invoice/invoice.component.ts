import { LocalStorageService } from './../services/local-storage.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tax } from '../models/tax.model';
import { TaxService } from '../services/tax.service';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss'
})
export class InvoiceComponent implements OnInit {
  invoice: Tax = new Tax('', 0, '', '', 0, '', []);

  constructor(private taxService: TaxService, private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    const invoiceCode = this.localStorageService.getItem('invoiceCode');
    console.log(invoiceCode);
    this.taxService.findByCode(invoiceCode || '').subscribe(invoice => {
      this.invoice = invoice;
    });
  }
}
