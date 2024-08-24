import { Comment } from "./comment.model";
import { Wish } from "./wish.model";

export class User {
  private id: number;
  private name: string;
  private lastname: string;
  private tel: string;
  private image: string;
  private email: string;
  private wisheList: Wish[];
  private comments: Comment[];
  private vip: string;

  constructor(id: number, name: string, lastname: string, tel: string, image: string, email: string, wisheList: Wish[], comments: Comment[], vip: string) {
    this.id = id;
    this.name = name;
    this.lastname = lastname;
    this.tel = tel;
    this.image = image;
    this.email = email;
    this.wisheList = wisheList;
    this.comments = comments;
    this.vip = vip;
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

  public getWisheList(): Array<Wish> {
    return this.wisheList;
  }

  public getComments(): Array<Comment> {
    return this.comments;
  }

  public getVip(): string {
    return this.vip;
  }

  public setVip(vip: string): void {
    this.vip = vip;
  }

  public setComments(comments: Array<Comment>): void {
    this.comments = comments;
  }

  public setWisheList(wishList: Array<Wish>): void {
    this.wisheList = wishList;
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
