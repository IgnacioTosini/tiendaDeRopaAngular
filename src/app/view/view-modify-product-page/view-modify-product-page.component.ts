import { Component, Input, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { ClothesStock } from '../../models/clothesStock.model';
import { SharedService } from '../../services/shared.service';
import { Subscription } from 'rxjs';
import { ClothesListComponent } from '../../clothe/clothes-list/clothes-list.component';

@Component({
  selector: 'app-view-modify-product-page',
  standalone: true,
  imports: [ClothesListComponent],
  templateUrl: './view-modify-product-page.component.html',
  styleUrls: ['./view-modify-product-page.component.scss']
})
export class ViewModifyProductPageComponent implements AfterViewInit, OnInit {
  @Input() selectedClothes: ClothesStock | null = null;
  @ViewChild('clothesList') clothesList!: ClothesListComponent;
  private subscription: Subscription = new Subscription();

  constructor(private sharedService: SharedService) {}

  ngOnInit() {
    this.subscription = this.sharedService.selectedClothes$.subscribe(clothes => {
      this.selectedClothes = clothes;
    });
  }

  ngAfterViewInit() {
    if (this.clothesList) {
      console.log('clothesList is available in ViewModifyProductPageComponent');
    } else {
      console.error('clothesList is not available in ViewModifyProductPageComponent');
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
