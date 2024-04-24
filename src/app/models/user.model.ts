export class User {
  private id: number;
  private name: string;
  private lastname: string;
  private tel: string;
  private image: string;
  private email: string;

  constructor( id: number, name: string, lastname: string, tel: string, image: string, email: string) {
    this.id = id;
    this.name = name;
    this.lastname = lastname;
    this.tel = tel;
    this.image = image;
    this.email = email;
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
    return this.tel;
  }

  public getImage(): string {
    return this.image;
  }

  public getEmail(): string {
    return this.email;
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

  public setCellphone(tel: string) {
    this.tel = tel;
  }

  public setImage(image: string) {
    this.image = image;
  }

  public setEmail(email: string) {
    this.email = email;
  }
}
