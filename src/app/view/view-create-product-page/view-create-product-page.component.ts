import { Component } from '@angular/core';
import { CreateClotheComponent } from '../../clothe/create-clothe/create-clothe.component';

@Component({
  selector: 'app-view-create-product-page',
  standalone: true,
  imports: [CreateClotheComponent],
  templateUrl: './view-create-product-page.component.html',
  styleUrls: ['./view-create-product-page.component.scss']
})
export class ViewCreateProductPageComponent { }
