import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EMPTY, catchError } from 'rxjs';
import { CommonModule, Location } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { ImageService } from '../../services/image.service'; // Importa el servicio de imagen
import { ClothesStockService } from '../../services/clothes-stock.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ClothesStock } from '../../models/clothesStock.model';
import { GlobalConstants } from '../../config/global-constants';
import { zoomInOut, slideInOutRight, slideInOutLeft } from '../../shared/animations/animation';
import { ToastNotificationComponent } from '../../toast-notification/toast-notification.component';
import { ProductReviewComponent } from '../product-review/product-review.component';
import { ImageModalComponent } from '../../img/image-modal/image-modal.component';
import { ProductGalleryComponent } from '../product-gallery/product-gallery.component';
import { ProductInfoComponent } from '../product-info/product-info.component';
import { GalleryComponent } from '../gallery/gallery.component';

@Component({
  selector: 'app-unique-product',
  standalone: true,
  imports: [
    FormsModule,
    GalleryComponent,
    ProductReviewComponent,
    CommonModule,
    ToastNotificationComponent,
    ImageModalComponent,
    ProductGalleryComponent,
    ProductInfoComponent
  ],
  animations: [slideInOutLeft, slideInOutRight, zoomInOut],
  templateUrl: './unique-product.component.html',
  styleUrls: ['./unique-product.component.scss']
})
export class UniqueProductComponent implements OnInit {
  product: ClothesStock = new ClothesStock('', '', 0, '', '', [], '', '', '', '', 0, []);
  quantity: number = 1;
  mainImage: string = '';
  smallImages: string[] = [];
  sizesAvailable: string[] = [];
  sizeQuantities: { [key: string]: number } = {}; // Añadido para almacenar las cantidades de cada tamaño
  isLoadingSizes: boolean = true;
  isLoadingImages: boolean = true;
  selectedSize: string = '';
  showNotification: boolean = false;
  selectedProduct: any;
  clickedButton: boolean = false;
  userLogged: boolean = this.authService.UserLogged;
  showModal: boolean = false;
  notificationType: string = '';

  constructor(
    private cartService: CartService,
    private route: ActivatedRoute,
    private clothesStockService: ClothesStockService,
    private authService: AuthService,
    private location: Location,
    private meta: Meta,
    private titleService: Title,
    private imageService: ImageService // Inyecta el servicio de imagen
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.smallImages = [];
      const code = params['code'];
      const state = this.location.getState() as { [key: string]: any };
      const name = state['name'];
      console.log(name);
      if (code !== null) {
        const searchParams = { name: name }; // Crear un objeto con los parámetros necesarios
        this.clothesStockService.findClothesByParameters(searchParams, 0, 10).pipe(
          catchError(error => {
            console.error('Error fetching product:', error);
            return EMPTY;
          })
        ).subscribe(response => {
          const products = response.clothes;
          console.log(products[0]);
          const product = products[0];
          this.product = product;

          if (product.getImages().length > 0) { // Verifica si hay imágenes
            this.mainImage = product.getImages()[0].getUrl();
            for (let i = 0; i < product.getImages().length; i++) {
              this.smallImages.push(product.getImages()[i].getUrl());
            }
            console.log("if");
            console.log(this.mainImage);
          }

          // Filtrar los tamaños disponibles y sus cantidades
          this.sizesAvailable = products.filter((p: ClothesStock) => p.getStock() > 0).map((p: ClothesStock) => p.getSize());
          this.sizeQuantities = products.reduce((acc: { [key: string]: number }, p: ClothesStock) => {
            acc[p.getSize()] = p.getStock();
            return acc;
          }, {});
          this.isLoadingSizes = false;
          this.isLoadingImages = false;

          // Si solo hay un tamaño disponible, seleccionarlo automáticamente
          if (this.sizesAvailable.length === 1) {
            this.selectedSize = this.sizesAvailable[0];
          }

          this.titleService.setTitle(this.product.getName());
          this.meta.addTags([
            { name: 'description', content: this.product.getDescription() },
            { name: 'author', content: GlobalConstants.storeName },
            { property: 'og:image', content: GlobalConstants.previewImageUrl },
            { property: 'og:url', content: window.location.href },
          ]);
        });
      }
    });
  }

  selectSize(size: string) {
    if (this.sizesAvailable.includes(size)) {
      this.selectedSize = this.selectedSize === size ? '' : size;
    }
  }

  changeMainImage(newImage: string) {
    this.mainImage = newImage;
  }

  updateQuantity(newQuantity: number) {
    this.quantity = newQuantity;
  }

  addToCart() {
    this.showNotification = false;
    this.clickedButton = true;

    if (this.product.getStock() < this.quantity) {
      console.error('No hay suficiente stock disponible');
      return;
    }

    if (this.selectedSize === '') {
      this.showAppropriateNotification('size');
      return;
    }

    if (!this.authService.UserLogged) {
      this.showAppropriateNotification('login');
      return;
    }

    console.log('Adding to cart:', this.product, this.quantity, this.selectedSize);
    this.cartService.addToCart(this.product, this.quantity, this.selectedSize);
    this.quantity = 1;
    this.selectedProduct = this.product;

    // Mostrar la notificación
    this.showAppropriateNotification('success');

    setTimeout(() => {
      console.log('Hiding notification');
      this.clickedButton = false;
      this.showNotification = false;
    }, 3500);
  }

  showAppropriateNotification(type: string) {
    this.notificationType = type; // Add this line
    if (type === 'login') {
      this.showNotification = true;
      this.clickedButton = true;
    } else if (type === 'size') {
      this.showNotification = true;
      this.clickedButton = true;
    } else if (type === 'success') {
      this.showNotification = true;
      this.clickedButton = false;
    }
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
}
