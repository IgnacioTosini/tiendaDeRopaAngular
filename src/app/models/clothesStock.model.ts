import { Clothes } from "./clothes.model";
import { Image } from "./images.model";

export class ClothesStock extends Clothes {
  private stock: number;
  private images: Image[];
  public currentImage: number;

  constructor(id: string, name: string, price: number, code: string, size: string, images: Image[], description: string, genericType: string, specificType: string, publicationDate: string, stock: number) {
    super(id, name, price, code, size, description, genericType, specificType, publicationDate);
    this.stock = stock;
    this.images = images;
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

  getReviews() {
    // Devuelve los comentarios actuales del producto
  }

  addReview(review: string) {
    // Añade un nuevo comentario a la lista de comentarios del producto
  }
}
