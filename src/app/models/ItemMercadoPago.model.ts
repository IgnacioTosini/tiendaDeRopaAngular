export class ItemMercadoPago {
  private id: string;
  private title: string;
  private quanty: number;
  private unitPrice: number;
  private currencyId: string;
  private description: string;

  constructor(id: string, title: string, quanty: number, unitPrice: number, currencyId: string, description: string) {
    this.id = id;
    this.title = title;
    this.quanty = quanty;
    this.unitPrice = unitPrice;
    this.currencyId = currencyId;
    this.description = description;
  }

  public getId(): string {
    return this.id;
  }

  public getTitle(): string {
    return this.title;
  }

  public getQuanty(): number {
    return this.quanty;
  }

  public getUnitPrice(): number {
    return this.unitPrice;
  }

  public getCurrencyId(): string {
    return this.currencyId;
  }

  public getDescription(): string {
    return this.description;
  }

  public setId(id: string): void {
    this.id = id;
  }

  public setTitle(title: string) {
    this.title = title;
  }

  public setQuanty(quanty: number) {
    this.quanty = quanty;
  }

  public setUnitPrice(unitPrice: number) {
    this.unitPrice = unitPrice;
  }

  public setCurrencyId(currencyId: string) {
    this.currencyId = currencyId;
  }

  public setDescription(description: string) {
    this.description = description;
  }
}
