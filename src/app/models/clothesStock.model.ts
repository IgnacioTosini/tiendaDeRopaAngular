import { Clothes } from "./clothes.model";
import { Image } from "./images.model";

export class ClothesStock extends Clothes {
  private stock: number;
  private images: Image[];
  private comments: Comment[];
  public currentImage: number;

  constructor(id: string, name: string, price: number, code: string, size: string, images: Image[], description: string, genericType: string, specificType: string, publicationDate: string, stock: number, comments: Comment[]) {
    super(id, name, price, code, size, description, genericType, specificType, publicationDate);
    this.stock = stock;
    this.images = images;
    this.comments = comments;
    this.currentImage = 0;
  }

  public getStock(): number {
    return this.stock;
  }

  public setStock(stock: number) {
    this.stock = stock;
  }

  public getImages(): Image[] {
    return this.images;
  }

  public setImages(images: Image[]) {
    this.images = images;
  }

  public changeImage(change: number) {
    const imagesCount = this.images.length;
    this.currentImage = (this.currentImage + change + imagesCount) % imagesCount;
  }

  public setActiveImage(imageIndex: number) {
    this.currentImage = imageIndex;
  }

  public getComments(): Comment[] {
    return this.comments;
  }

  public setComments(comments: Comment[]) {
    this.comments = comments;
  }
}
