import { Clothes } from "./clothes.model";

export class ClothesStock extends Clothes{
  private stock: number;

  constructor( id: number, name: string, price: number, code: string, size: string, image: string, description: number, genericType: string, specificType: string, publicationDate: Date, stock: number) {
    super(id, name, price, code, size, image, description, genericType, specificType, publicationDate);
    this.stock = stock;
  }

  public getStock(): number {
    return this.stock;
  }

  public setStock(stock: number) {
    this.stock = stock;
  }
}
