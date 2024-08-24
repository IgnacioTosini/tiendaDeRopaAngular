import { ClothesStock } from "./clothesStock.model";
import { User } from "./user.model";

export class Comment{
  private id: number;
  private text: string;
  private avalible: boolean;
  private user: string;
  private clothe: ClothesStock;

  constructor(id: number, text: string, avalible: boolean, user: string, clothe: ClothesStock) {
    this.id = id;
    this.text = text;
    this.avalible = avalible;
    this.user = user;
    this.clothe = clothe;
  }

  public getId(): number {
    return this.id;
  }

  public getText(): string {
    return this.text;
  }

  public getAvalible(): boolean {
    return this.avalible;
  }

  public getUser(): string {
    return this.user;
  }

  public getClothe(): ClothesStock {
    return this.clothe;
  }

  public setId(id: number) {
    this.id = id;
  }

  public setText(text: string) {
    this.text = text;
  }

  public setAvalible(avalible: boolean) {
    this.avalible = avalible;
  }

  public setUser(user: string) {
    this.user = user;
  }

  public setClothe(clothe: ClothesStock) {
    this.clothe = clothe;
  }
}
