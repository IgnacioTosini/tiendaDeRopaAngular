import { User } from "./user.model";

export class Wish {
  private id: string;
  private url: string;
  private name: string;
  private photo: string;
  private users: User[];

  constructor(id: string, url: string, name: string, photo: string, users: User[]) {
    this.id = id;
    this.url = url;
    this.name = name;
    this.photo = photo;
    this.users = users;
  }

  public getId(): string {
    return this.id;
  }

  public getUrl(): string {
    return this.url;
  }

  public getName(): string {
    return this.name;
  }

  public getPhoto(): string {
    return this.photo;
  }

  public getUsers(): User[] {
    return this.users;
  }

  public setId(id: string) {
    this.id = id;
  }

  public setUrl(url: string) {
    this.url = url;
  }

  public setName(name: string) {
    this.name = name;
  }

  public setPhoto(photo: string) {
    this.photo = photo;
  }

  public setUsers(users: User[]) {
    this.users = users;
  }
}
