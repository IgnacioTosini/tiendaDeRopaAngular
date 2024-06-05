import { Clothes } from "./clothes.model";

export class ClothesSold extends Clothes {
  private cant: number

  constructor( id: string, name: string, price: number, code: string, size: string, description: string, genericType: string, specificType: string, publication: string, cant: number) {
    super(id, name, price, code, size, description, genericType, specificType, publication);
    this.cant = cant;
  }

  public getcant(): number {
    return this.cant;
  }

  public setcant(cant: number) {
    this.cant = cant;
  }
}
