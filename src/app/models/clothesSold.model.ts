import { Clothes } from "./clothes.model";

export class ClothesSold extends Clothes {
  private quantity: number

  constructor( id: number, name: string, price: number, code: string, size: string, image: string, description: number, genericType: string, specificType: string, publicationDate: Date, quantity: number) {
    super(id, name, price, code, size, image, description, genericType, specificType, publicationDate);
    this.quantity = quantity;
  }

  public getQuantity(): number {
    return this.quantity;
  }

  public setQuantity(quantity: number) {
    this.quantity = quantity;
  }
}
