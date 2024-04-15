export class Clothes{
  private id: number
  private name: string
  private price: number
  private code: string
  private size: string
  private image: string
  private description: number
  private genericType: string
  private specificType: string
  private publicationDate: Date

  constructor( id: number, name: string, price: number, code: string, size: string, image: string, description: number, genericType: string, specificType: string, publicationDate: Date) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.code = code;
    this.size = size;
    this.image = image;
    this.description = description;
    this.genericType = genericType;
    this.specificType = specificType;
    this.publicationDate = publicationDate;
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

  public getSize(): string {
    return this.size;
  }

  public getImage(): string {
    return this.image;
  }

  public getDescription(): number {
    return this.description;
  }

  public getGenericType(): string {
    return this.genericType;
  }

  public getSpecificType(): string {
    return this.specificType;
  }

  public getPublicationDate(): Date {
    return this.publicationDate;
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

  public setSize(size: string) {
    this.size = size;
  }

  public setImage(image: string) {
    this.image = image;
  }

  public setDescription(description: number) {
    this.description = description;
  }

  public setGenericType(genericType: string) {
    this.genericType = genericType;
  }

  public setSpecificType(specificType: string) {
    this.specificType = specificType;
  }

  public setPublicationDate(publicationDate: Date) {
    this.publicationDate = publicationDate;
  }
}
