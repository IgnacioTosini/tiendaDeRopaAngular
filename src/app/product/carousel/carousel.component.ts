import { ImageService } from './../../services/image.service';
import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { ClothesStockService } from '../../services/clothes-stock.service';
import { ClothesStock } from '../../models/clothesStock.model';
import { SkeletonService } from '../../services/skeleton-service.service';
import { GlobalConstants } from '../../config/global-constants';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent {
  clothes: ClothesStock[] = [];
  skeletonItems: number[] = [];
  currentImageIndex = 0;
  startX!: number;
  isDragging = false;
  selectedClothe: ClothesStock | null = null;
  isLoading: boolean = true;

  constructor(
    private clothesStockService: ClothesStockService,
    private router: Router,
    private meta: Meta,
    private titleService: Title,
    private skeletonService: SkeletonService,
    private imageService: ImageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  async ngOnInit() {
    this.titleService.setTitle('Clothes Carousel - Best Fashion Collection');

    let ogUrlContent = '';
    if (isPlatformBrowser(this.platformId)) {
      ogUrlContent = window.location.href;
    }

    this.meta.addTags([
      { name: 'description', content: 'Discover the best fashion collection in our clothes carousel. Find the latest trends and styles.' },
      { name: 'keywords', content: 'fashion, clothes, carousel, trends, styles' },
      { name: 'author', content: GlobalConstants.storeName },
      { property: 'og:image', content: GlobalConstants.previewImageUrl },
      { property: 'og:url', content: ogUrlContent },
    ]);
    this.skeletonItems = this.skeletonService.generateSkeletonItems(5);
    const randomStartIndex = Math.floor(Math.random() * 2);
    await this.clothesStockService.findAll(randomStartIndex, 5).toPromise();
    this.clothes = this.clothesStockService.clothesArray;
    this.isLoading = false;
  }

  nextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.clothes.length;
  }

  previousImage() {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.clothes.length) % this.clothes.length;
  }

  handleImageClick(index: number) {
    this.currentImageIndex = index;
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.startX = event.clientX;
    this.isDragging = true;
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) {
      return;
    }

    const x = event.clientX;
    const diff = this.startX - x;

    if (diff > 0) {
      this.nextImage();
    } else if (diff < 0) {
      this.previousImage();
    }

    this.isDragging = false;
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp() {
    this.isDragging = false;
  }

  viewProduct(clothe: ClothesStock): void {
    this.router.navigate(['/product', clothe.getCode()], { state: { name: clothe.getName() } }).then(() => {
      window.scrollTo(0, 0);
    });
  }

  onImageError(event: Event) {
    this.imageService.handleImageError(event);
  }
}
