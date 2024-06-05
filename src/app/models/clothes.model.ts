export class Clothes{
  private id: string
  private name: string
  private price: number
  private code: string
  private size: string
  private description: string
  private genericType: string
  private specificType: string
  private publication: string

  constructor( id: string, name: string, price: number, code: string, size: string, description: string, genericType: string, specificType: string, publication: string) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.code = code;
    this.size = size;
    this.description = description;
    this.genericType = genericType;
    this.specificType = specificType;
    this.publication = publication;
  }

  public getId(): string {
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

  public getDescription(): string {
    return this.description;
  }

  public getGenericType(): string {
    return this.genericType;
  }

  public getSpecificType(): string {
    return this.specificType;
  }

  public getPublicationDate(): string {
    return this.publication;
  }

  setId(id: string) {
    this.id = id;
  }

  setName(name: string) {
    this.name = name;
  }

  setPrice(price: number) {
    this.price = price;
  }

  setCode(code: string) {
    this.code = code;
  }

  setSize(size: string) {
    this.size = size;
  }

  setDescription(description: string) {
    this.description = description;
  }

  setGenericType(genericType: string) {
    this.genericType = genericType;
  }

  setSpecificType(specificType: string) {
    this.specificType = specificType;
  }

  setPublicationDate(publication: string) {
    this.publication = publication;
  }
}
