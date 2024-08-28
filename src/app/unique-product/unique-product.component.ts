import { AuthService } from './../services/auth.service';
import { ClothesStockService } from './../services/clothes-stock.service';
import { CartService } from './../services/cart.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClothesStock } from '../models/clothesStock.model';
import { FormsModule } from '@angular/forms';
import { GalleryComponent } from '../gallery/gallery.component';
import { EMPTY, catchError } from 'rxjs';
import { ProductReviewComponent } from '../product-review/product-review.component';
import { CommonModule } from '@angular/common';
import { ToastNotificationComponent } from '../toast-notification/toast-notification.component';

@Component({
  selector: 'app-unique-product',
  standalone: true,
  imports: [FormsModule, GalleryComponent, ProductReviewComponent, CommonModule, ToastNotificationComponent],
  templateUrl: './unique-product.component.html',
  styleUrl: './unique-product.component.scss'
})
export class UniqueProductComponent {
  product: ClothesStock = new ClothesStock('', '', 0, '', '', [], '', '', '', '', 0, []);
  quantity: number = 1;
  mainImage: string = '';
  smallImages: string[] = [];
  sizeFilter: string = '';
  sizesAvailable: string[] = [];
  isLoadingSizes: boolean = true;
  selectedSize: string = '';
  showNotification: boolean = false;
  selectedProduct: any;
  clickedButton: boolean = false;
  userLogged: boolean = this.authService.UserLogged;

  @ViewChild('mainImageDiv') mainImageDiv!: ElementRef;
  @ViewChild('zoomLensDiv') zoomLensDiv!: ElementRef;
  @ViewChild('zoomResultDiv') zoomResultDiv!: ElementRef;

  constructor(private CartService: CartService, private route: ActivatedRoute, private clothesStockService: ClothesStockService, private authService: AuthService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.smallImages = [];
      const code = params['code'];
      if (code !== null) {
        this.clothesStockService.findByCode(code).pipe(
          catchError(error => {
            console.error('Error fetching product:', error);
            return EMPTY;
          })
        ).subscribe(products => {
          const product = products[0];
          this.product = product;

          if (product.getImages().length > 0) { // Verifica si hay imágenes
            this.mainImage = product.getImages()[0].getUrl();
            for (let i = 0; i < product.getImages().length; i++) {
              this.smallImages.push(product.getImages()[i].getUrl());
            }
          }

          // Filtrar los tamaños disponibles
          this.sizesAvailable = products.filter((p: ClothesStock) => p.getStock() > 0).map((p: ClothesStock) => p.getSize());
          this.isLoadingSizes = false;

          // Si solo hay un tamaño disponible, seleccionarlo automáticamente
          if (this.sizesAvailable.length === 1) {
            this.selectedSize = this.sizesAvailable[0];
          }
        });
      }
    });
  }

  selectSize(size: string) {
    if (this.sizesAvailable.includes(size)) {
      this.selectedSize = this.selectedSize === size ? '' : size;
    }
  }
  zoomImage(event: MouseEvent) {
    if (window.innerWidth < 768) {
      return;
    }
    const lens = this.zoomLensDiv.nativeElement;
    const result = this.zoomResultDiv.nativeElement;
    const img = this.mainImageDiv.nativeElement;

    /* Calculate the ratio between result DIV and lens: */
    const cx = result.offsetWidth / lens.offsetWidth;
    const cy = result.offsetHeight / lens.offsetHeight;

    /* Set background properties for the result DIV */
    result.style.backgroundImage = `url('${this.mainImage}')`;
    result.style.backgroundSize = `${img.width * cx}px ${img.height * cy}px`;

    /* Execute a function when someone moves the cursor over the image, or the lens: */
    const getCursorPos = (e: MouseEvent) => {
      let x = 0, y = 0;
      e = e || window.event;
      /* Get the x and y positions of the image: */
      const a = img.getBoundingClientRect();
      /* Calculate the cursor's x and y coordinates, relative to the image: */
      x = e.pageX - a.left;
      y = e.pageY - a.top;
      /* Consider any page scrolling: */
      x = x - window.pageXOffset;
      y = y - window.pageYOffset;
      return { x: x, y: y };
    }

    const moveLens = (e: MouseEvent) => {
      /* Prevent any other actions that may occur when moving over the image */
      e.preventDefault();
      /* Get the cursor's x and y positions: */
      const pos = getCursorPos(e);
      /* Calculate the position of the lens: */
      let x = pos.x - (lens.offsetWidth / 2);
      let y = pos.y - (lens.offsetHeight / 2);
      /* Prevent the lens from being positioned outside the image: */
      if (x > img.width - lens.offsetWidth + 220) { x = img.width - lens.offsetWidth + 220; }
      if (x < -220) { x = -220; }
      if (y > img.height - lens.offsetHeight + 150) { y = img.height - lens.offsetHeight + 150; }
      if (y < -150) { y = -150; }
      /* Set the position of the lens: */
      lens.style.left = x + 'px';
      lens.style.top = y + 'px';
      /* Set the position of the result div to be just above and to the right of the cursor: */
      result.style.left = (e.pageX + 20) + 'px'; // 20px to the right
      result.style.top = (e.pageY - result.offsetHeight + 30) + 'px'; // 30px down
      /* Display what the lens "sees": */
      result.style.backgroundPosition = "-" + ((x + 220) * cx) + "px -" + ((y + 150) * cy) + "px"; // Adjust the zoom position
    }

    moveLens(event);
    /* Display the magnifier effect: */
    result.style.display = "block";
  }

  resetZoom() {
    this.zoomResultDiv.nativeElement.style.backgroundImage = 'none';
    /* Hide the magnifier effect: */
    this.zoomResultDiv.nativeElement.style.display = "none";
  }

  changeMainImage(newImage: string) {
    this.mainImage = newImage;
  }

  sumAmount() {
    this.quantity++;
  }

  subtractQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    this.showNotification = false;
    this.clickedButton = true;

    if (this.product.getStock() < this.quantity) {
      console.error('No hay suficiente stock disponible');
      return;
    }

    setTimeout(() => {
      console.log('Hiding notification');
      this.clickedButton = false;
      this.showNotification = false;
    }, 3500);

    if (this.selectedSize !== '' && this.authService.UserLogged) {
      this.clickedButton = false;
      console.log('Adding to cart:', this.product, this.quantity, this.selectedSize);
      this.CartService.addToCart(this.product, this.quantity, this.selectedSize);
      this.quantity = 1;

      this.selectedProduct = this.product;

      // Mostrar la notificación
      this.showNotification = true;
    }
  }
}
