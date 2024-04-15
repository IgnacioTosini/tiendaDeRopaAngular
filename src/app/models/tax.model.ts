import { ClothesSold } from "./clothesSold.model";

export class Tax{
  private id: number;
  private name: string;
  private price: number;
  private code: string;
  private adress: string;
  private traverCost: number;
  private date: Date;
  private clothes: ClothesSold[];

  constructor( id: number, name: string, price: number, code: string, adress: string, traverCost: number, date: Date, clothes: ClothesSold) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.code = code;
    this.adress = adress;
    this.traverCost = traverCost;
    this.date = date;
    this.clothes = [clothes];
  }

  public getId(): number {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getPrice(): number {
    return this.price;
  }

  public getCode(): string {
    return this.code;
  }

  public getAdress(): string {
    return this.adress;
  }

  public getTraverCost(): number {
    return this.traverCost;
  }

  public getDate(): Date {
    return this.date;
  }

  public getClothes(): ClothesSold[] {
    return this.clothes;
  }

  public setId(id: number) {
    this.id = id;
  }

  public setName(name: string) {
    this.name = name;
  }

  public setPrice(price: number) {
    this.price = price;
  }

  public setCode(code: string) {
    this.code = code;
  }

  public setAdress(adress: string) {
    this.adress = adress;
  }

  public setTraverCost(traverCost: number) {
    this.traverCost = traverCost;
  }

  public setDate(date: Date) {
    this.date = date;
  }

  public setClothes(clothes: ClothesSold) {
    this.clothes.push(clothes);
  }
}
