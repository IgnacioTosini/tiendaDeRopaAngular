import { ClothesStockService } from './../services/clothes-stock.service';
import { CartService } from './../services/cart.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Clothes } from '../models/clothes.model';
import { ActivatedRoute } from '@angular/router';
import { ClothesStock } from '../models/clothesStock.model';

@Component({
  selector: 'app-unique-product',
  standalone: true,
  imports: [],
  templateUrl: './unique-product.component.html',
  styleUrl: './unique-product.component.scss'
})
export class UniqueProductComponent {
  product: Clothes = new ClothesStock(1, 'Camisa', 100, '1234', 'M', '../../assets/photos/shirtGeneric.jpeg', 'Camisa de algodón', 'Ropa', 'Camisa', '2022-01-01', 4);
  quantity: number = 1;
  mainImage: string = '../../assets/photos/shirtGeneric.jpeg';
  smallImages: string[] = [
    '../../assets/photos/shirtGeneric.jpeg',
    '../../assets/photos/logo-instagram.svg',
    '../../assets/photos/logoGeneric.png'
  ];

  @ViewChild('mainImageDiv') mainImageDiv!: ElementRef;
  @ViewChild('zoomLensDiv') zoomLensDiv!: ElementRef;
  @ViewChild('zoomResultDiv') zoomResultDiv!: ElementRef;

  constructor(private CartService: CartService, private route: ActivatedRoute, private ClothesStockService: ClothesStockService) { }

  ngOnInit() {
    const code = this.route.snapshot.paramMap.get('code');
    if (code !== null) {
      this.ClothesStockService.findByCode(code).subscribe(product => {
        this.product = product;
        this.mainImage = product.image;
        this.smallImages = product.images; // Asegúrate de que tu modelo Clothes tenga una propiedad images que sea un array de strings
      });
    }
  }

  zoomImage(event: MouseEvent) {
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
    this.product.setImage(this.mainImage);
  }

  sumAmount() {
    this.quantity++;
    // Aquí puedes agregar el código para añadir el producto al carrito
  }

  subtractQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
      // Aquí puedes agregar el código para remover el producto del carrito
    }
  }

  addToCart() {
    this.CartService.addToCart(this.product, this.quantity);
  }
}
