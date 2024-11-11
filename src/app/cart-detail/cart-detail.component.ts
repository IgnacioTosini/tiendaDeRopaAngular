import { ClothesStockService } from './../services/clothes-stock.service';
import { MercadoPagoService } from './../services/mercado-pago.service';
import { LocalStorageService } from './../services/local-storage.service';
import { AuthService } from './../services/auth.service';
import { Component } from '@angular/core';
import { CartService } from '../services/cart.service';
import { ClothesStock } from '../models/clothesStock.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Tax } from '../models/tax.model';
import { TaxService } from '../services/tax.service';
import { User } from '../models/user.model';
import { ClothesSold } from '../models/clothesSold.model';
import { ItemMercadoPago } from '../models/ItemMercadoPago.model';
import { ToastNotificationComponent } from '../toast-notification/toast-notification.component';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { CartActionsComponent } from '../cart-actions/cart-actions.component';

@Component({
  selector: 'app-cart-detail',
  standalone: true,
  imports: [ToastNotificationComponent, CartItemComponent, CartActionsComponent],
  templateUrl: './cart-detail.component.html',
  styleUrls: ['./cart-detail.component.scss']
})
export class CartDetailComponent {
  cartItems: { product: ClothesStock, quantity: number }[] = [];
  user: User = new User(0, '', '', '', '', '', [], [], '');
  showSubmenu: boolean = false;
  showNotification: boolean = false;
  notificationMessage: string = '';
  typeOfNotification: boolean = false;

  constructor(
    public cartService: CartService,
    private router: Router,
    private route: ActivatedRoute,
    private taxService: TaxService,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private mercadoPagoService: MercadoPagoService,
    private clothesStockService: ClothesStockService
  ) {
    this.cartService.getItems().subscribe(items => {
      this.cartItems = items;
    });
  }

  async ngOnInit() {
    try {
      this.user = await this.authService.UserData;
      console.log('User data:', this.user);
      console.log(this.cartItems);
    } catch (error) {
      console.error('Error fetching user data:', error);
      console.log(this.user);
    }

    // Manejar las URLs de retorno
    this.route.queryParams.subscribe(params => {
      if (params['status'] === 'success') {
        this.handleSuccess();
      } else if (params['status'] === 'failure') {
        this.handleFailure();
      } else if (params['status'] === 'pending') {
        this.handlePending();
      }
    });
  }

  private handleNotification(message: string, isSuccess: boolean): void {
    this.notificationMessage = message;
    this.typeOfNotification = isSuccess;
    this.showNotification = true;
    setTimeout(() => {
      this.showNotification = false;
    }, 5000);
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

    // Guardar la factura en el backend
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

        // Navega al componente de factura después de confirmar la compra
        this.router.navigate(['/invoice']);

        // Limpia el carrito
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
    /*     const backUrls = {
          success: 'http://localhost:4200/success',
          pending: 'http://localhost:4200/pending',
          failure: 'http://localhost:4200/failure'
        }; */

    this.mercadoPagoService.createPreferences(productos).subscribe((response: any) => {
      console.log('Response:', response);
      window.open(response.initPoint, '_blank'); // Abrir en una nueva pestaña
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
      console.log(soldItem)
      console.log(this.cartItems)
      const stockItem = this.cartItems.find(item => item.product.getCode() === soldItem.getCode() && item.product.getSize() === soldItem.getSize())?.product;
      console.log(stockItem)
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
}
