import { ClothesSold } from "./clothesSold.model";

export class Tax {
  private id: string;
  private price: number;
  private code: string;
  private adress: string;
  private travelCost: number;
  private date: string;
  private clothes: ClothesSold[];

  constructor(id: string, price: number, code: string, adress: string, travelCost: number, date: string, clothes: ClothesSold[]) {
    this.id = id;
    this.price = price;
    this.code = code;
    this.adress = adress;
    this.travelCost = travelCost;
    this.date = date;
    this.clothes = clothes;
  }

  public getId(): string {
    return this.id;
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

  public gettravelCost(): number {
    return this.travelCost;
  }

  public getDate(): string {
    return this.date;
  }

  public getClothes(): ClothesSold[] {
    return this.clothes;
  }

  public setId(id: string) {
    this.id = id;
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

  public settravelCost(travelCost: number) {
    this.travelCost = travelCost;
  }

  public setDate(date: string) {
    this.date = date;
  }

  public setClothes(clothes: ClothesSold) {
    this.clothes.push(clothes);
  }
}
