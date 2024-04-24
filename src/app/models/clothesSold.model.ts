import { Clothes } from "./clothes.model";

export class ClothesSold extends Clothes {
  private cant: number

  constructor( id: number, name: string, price: number, code: string, size: string, image: string, description: string, genericType: string, specificType: string, publication: string, cant: number) {
    super(id, name, price, code, size, image, description, genericType, specificType, publication);
    this.cant = cant;
  }

  public getcant(): number {
    return this.cant;
  }

  public setcant(cant: number) {
    this.cant = cant;
  }
}
