import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { CartService } from '../../services/cart.service';
import { ClothesStockService } from '../../services/clothes-stock.service';
import { MercadoPagoService } from '../../services/mercado-pago.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { AuthService } from '../../services/auth.service';
import { TaxService } from '../../services/tax.service';
import { NotificationService } from '../../services/notification.service';
import { SkeletonService } from '../../services/skeleton-service.service';
import { ClothesStock } from '../../models/clothesStock.model';
import { Tax } from '../../models/tax.model';
import { User } from '../../models/user.model';
import { ClothesSold } from '../../models/clothesSold.model';
import { ItemMercadoPago } from '../../models/ItemMercadoPago.model';
import { ToastNotificationComponent } from '../../toast-notification/toast-notification.component';
import { CartActionsComponent } from '../cart-actions/cart-actions.component';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { GlobalConstants } from '../../config/global-constants';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-cart-detail',
  standalone: true,
  imports: [ToastNotificationComponent, CartItemComponent, CartActionsComponent],
  templateUrl: './cart-detail.component.html',
  styleUrls: ['./cart-detail.component.scss']
})
export class CartDetailComponent implements OnInit {
  cartItems: { product: ClothesStock, quantity: number }[] = [];
  user: User = new User(0, '', '', '', '', '', [], [], '');
  showSubmenu: boolean = false;
  isLoading: boolean = true;
  skeletonItems: number[] = [];

  constructor(
    public cartService: CartService,
    private router: Router,
    private route: ActivatedRoute,
    private taxService: TaxService,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private mercadoPagoService: MercadoPagoService,
    private clothesStockService: ClothesStockService,
    public notificationService: NotificationService,
    private titleService: Title,
    private metaService: Meta,
    @Inject(PLATFORM_ID) private platformId: Object,
    private skeletonService: SkeletonService
  ) {
    this.cartService.getItems().subscribe(items => {
      this.cartItems = items;
    });
  }

  async ngOnInit() {
    this.skeletonItems = this.skeletonService.generateSkeletonItems(this.cartItems.length || 3);
    try {
      this.user = await this.authService.UserData;
      console.log('User data:', this.user);
      console.log(this.cartItems);
    } catch (error) {
      console.error('Error fetching user data:', error);
      console.log(this.user);
    } finally {
      this.isLoading = false;
    }

    this.route.queryParams.subscribe(params => {
      if (params['status'] === 'success') {
        this.handleSuccess();
      } else if (params['status'] === 'failure') {
        this.handleFailure();
      } else if (params['status'] === 'pending') {
        this.handlePending();
      }
    });

    let ogUrlContent = '';
    if (isPlatformBrowser(this.platformId)) {
      ogUrlContent = window.location.href;
    }

    this.titleService.setTitle('Detalle del Carrito - Tienda de Ropa');
    this.metaService.addTags([
      { name: 'description', content: 'Review the products in your shopping cart and proceed to checkout.' },
      { name: 'keywords', content: 'shopping cart, clothing store, buy clothes online, fashion, ecommerce' },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: 'Shopping Cart Details - Clothing Store' },
      { property: 'og:description', content: 'Review the products in your shopping cart and proceed to checkout.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: ogUrlContent },
      { name: 'author', content: GlobalConstants.storeName },
      { property: 'og:image', content: GlobalConstants.previewImageUrl },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Shopping Cart Details - Clothing Store' },
      { name: 'twitter:description', content: 'Review the products in your shopping cart and proceed to checkout.' },
      { name: 'twitter:image', content: GlobalConstants.previewImageUrl }
    ]);
  }

  viewProduct(clothe: ClothesStock): void {
    this.router.navigate(['/product', clothe.getCode()], { state: { name: clothe.getName() } }).then(() => {
      window.scrollTo(0, 0);
    });
  }

  removeItem(item: { product: ClothesStock }) {
    this.cartService.removeFromCart(item.product);
    this.handleNotification('Producto eliminado del carrito', true);
  }

  clearCart() {
    this.cartService.clearCart();
    this.handleNotification('Carrito vaciado', true);
  }

  getTotalPriceForProduct(product: ClothesStock, quantity: number): string {
    const totalPrice = this.cartService.getTotalPriceForProduct(product, quantity);
    return totalPrice.toFixed(2);
  }

  async getAllTaxes() {
    let allTaxes;
    try {
      allTaxes = await this.taxService.findAll(0, 10).toPromise();
    } catch (error) {
      console.error('Error al obtener todas las facturas:', error);
      allTaxes = [];
    }
    console.log('Todas las facturas:', allTaxes);
    return allTaxes.invoice;
  }

  generateRandomCode() {
    let randomCode = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';

    for (let i = 0; i < 5; i++) {
      randomCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    for (let i = 0; i < 2; i++) {
      randomCode += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return randomCode;
  }

  createClothesSoldItems() {
    return this.cartItems.map(item => {
      const product = item.product;
      return new ClothesSold(
        '',
        product.getName(),
        product.getPrice(),
        product.getCode(),
        product.getSize(),
        product.getDescription(),
        product.getGenericType(),
        product.getSpecificType(),
        product.getPublicationDate(),
        item.quantity
      );
    });
  }

  createTax(randomCode: string, clothesSoldItems: ClothesSold[]) {
    let date = new Date();
    let formattedDate = date.toISOString().slice(0, 10);
    return new Tax(
      '', // id
      this.cartService.getTotalPrice(), // price
      randomCode, // code
      'none', // adress
      0, // traverCost
      formattedDate, // date
      clothesSoldItems // clothes
    );
  }

  createItemMercadoPago(clothesSoldItems: ClothesSold[]) {
    return clothesSoldItems.map((item: ClothesSold) => {
      return new ItemMercadoPago(
        item.getId(),
        item.getName(),
        item.getcant(),
        item.getPrice(),
        'ARS',
        item.getDescription(),
      );
    });
  }

  toggleSubmenu() {
    this.showSubmenu = !this.showSubmenu;
  }

  private createClothesSoldFromResponse(response: any): ClothesSold[] {
    return response.body.clothes.map((item: any) => {
      return new ClothesSold(
        item.id,
        item.name,
        item.price,
        item.code,
        item.size,
        item.description,
        item.genericType,
        item.specificType,
        item.publication,
        item.cant
      );
    });
  }

  async payInCash() {
    const randomCode = this.generateRandomCode();
    const clothesSoldItems = this.createClothesSoldItems();
    const tax = this.createTax(randomCode, clothesSoldItems);
    console.log('Factura a guardar:', tax);

    this.taxService.create(this.user.getId().toString(), tax).subscribe({
      next: (response: any) => {
        console.log('Factura creada:', response);
        this.localStorageService.setItem('invoiceCode', JSON.stringify(randomCode));
        console.log('Código de factura guardado:', randomCode);

        const arrayClothesSoldItems = this.createClothesSoldFromResponse(response);
        console.log(arrayClothesSoldItems);

        const updatedClothesStockItems = this.updateClothesStock(arrayClothesSoldItems);

        updatedClothesStockItems.forEach(item => {
          this.clothesStockService.createUpdate(item).subscribe({
            next: () => {
              console.log('Stock actualizado:', item.clothe);
            },
            error: (err) => {
              console.error('Error al actualizar el stock:', err);
            }
          });
        });

        this.router.navigate(['/invoice']);
        this.clearCart();
      },
      error: (err) => {
        console.error('Error al crear la factura:', err);
      }
    });
  }

  async payWithMercadoPago() {
    const clothesSoldItems = this.createClothesSoldItems();
    const itemsMercadoPago = this.createItemMercadoPago(clothesSoldItems);
    this.compraMercadoPago(itemsMercadoPago);
  }

  async compraMercadoPago(productos: any) {
    this.mercadoPagoService.createPreferences(productos).subscribe((response: any) => {
      console.log('Response:', response);
      window.open(response.initPoint, '_blank');
      this.clearCart();
    }, (error) => {
      console.error('Error creating preferences:', error);
    });
  }

  private handleSuccess() {
    this.clearCart();
    this.handleNotification('Compra exitosa', true);
  }

  private handleFailure() {
    this.handleNotification('Compra fallida', false);
  }

  private handlePending() {
    this.handleNotification('Compra pendiente', false);
  }

  private updateClothesStock(clothesSoldItems: ClothesSold[]): { clothe: ClothesStock, subject: string, message: string }[] {
    return clothesSoldItems.map(soldItem => {
      const stockItem = this.cartItems.find(item => item.product.getCode() === soldItem.getCode() && item.product.getSize() === soldItem.getSize())?.product;
      if (stockItem) {
        const updatedStock = stockItem.getStock() - soldItem.getcant();
        const updatedClothe = new ClothesStock(
          stockItem.getId(),
          stockItem.getName(),
          stockItem.getPrice(),
          stockItem.getCode(),
          stockItem.getSize(),
          stockItem.getImages(),
          stockItem.getDescription(),
          stockItem.getGenericType(),
          stockItem.getSpecificType(),
          stockItem.getPublicationDate(),
          updatedStock,
          stockItem.getComments()
        );
        return {
          clothe: updatedClothe,
          subject: '',
          message: ``
        };
      }
      throw new Error(`Stock item not found for sold item with ID: ${soldItem.getId()}`);
    });
  }

  private handleNotification(message: string, isSuccess: boolean): void {
    this.notificationService.handleNotification(message, isSuccess);
  }
}
