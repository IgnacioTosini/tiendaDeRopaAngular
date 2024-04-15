import { Tax } from './tax.model';
export class User {
  private id: number;
  private name: string;
  private lastname: string;
  private cellphone: string;
  private image: string;
  private taxs: Tax[];
  private email: string;
  private role: string;

  constructor( id: number, name: string, lastname: string, cellphone: string, image: string, taxs: Tax, email: string, role: string) {
    this.id = id;
    this.name = name;
    this.lastname = lastname;
    this.cellphone = cellphone;
    this.image = image;
    this.taxs = [taxs];
    this.email = email;
    this.role = role;
  }

  public getId(): number {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getLastname(): string {
    return this.lastname;
  }

  public getCellphone(): string {
    return this.cellphone;
  }

  public getImage(): string {
    return this.image;
  }

  public getTaxs(): Tax[] {
    return this.taxs;
  }

  public getEmail(): string {
    return this.email;
  }

  public getRole(): string {
    return this.role;
  }

  public setId(id: number) {
    this.id = id;
  }

  public setName(name: string) {
    this.name = name;
  }

  public setLastname(lastname: string) {
    this.lastname = lastname;
  }

  public setCellphone(cellphone: string) {
    this.cellphone = cellphone;
  }

  public setImage(image: string) {
    this.image = image;
  }

  public setTaxs(taxs: Tax) {
    this.taxs = [taxs];
  }

  public setEmail(email: string) {
    this.email = email;
  }

  public setRole(role: string) {
    this.role = role;
  }

  public addTax(tax: Tax) {
    this.taxs.push(tax);
  }

/*   public removeTax(tax: Tax) {
    const index = this.taxs.indexOf(tax);
    if (index > -1) {
      this.taxs.splice(index, 1);
    }
  } */
}
