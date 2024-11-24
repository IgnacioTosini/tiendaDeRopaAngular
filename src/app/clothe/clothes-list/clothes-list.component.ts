import { Component, OnInit, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { slideInOutLeft, slideInOutRight, zoomInOut } from '../../shared/animations/animation';
import { ToastNotificationComponent } from '../../toast-notification/toast-notification.component';
import { ClothesStock } from '../../models/clothesStock.model';
import { ClothesStockService } from '../../services/clothes-stock.service';
import { ImageService } from '../../services/image.service';
import { Image } from '../../models/images.model';
import { NotificationService } from '../../services/notification.service';
import { Meta, Title } from '@angular/platform-browser';
import { GlobalConstants } from '../../config/global-constants';
import { PaginationComponent } from '../../pagination/pagination.component';
import { Pagination } from '../../models/pagination.model';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-clothes-list',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, ToastNotificationComponent, PaginationComponent],
  animations: [slideInOutLeft, slideInOutRight, zoomInOut],
  templateUrl: './clothes-list.component.html',
  styleUrls: ['./clothes-list.component.scss']
})
export class ClothesListComponent implements OnInit, OnChanges {
  @ViewChild('clothesListContainer') clothesListContainer!: ElementRef;
  @Input() selectedClothes: ClothesStock | null = null;
  clothesList: ClothesStock[] = [];
  selectedImage: string = '';
  previewImage: string = '';
  pagination: Pagination | null = null;
  currentPage: number = 0;
  clothesForm = new FormGroup({
    name: new FormControl('', Validators.required),
    price: new FormControl(0, [Validators.required, Validators.min(0)]),
    stock: new FormControl(0, [Validators.required, Validators.min(0)]),
    code: new FormControl('', Validators.required),
    size: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    genericType: new FormControl('', Validators.required),
    specificType: new FormControl('', Validators.required)
  }, { validators: this.specificTypeValidator.bind(this) });
  message: string = '';
  subject: string = '';
  lastImageId: number = 0;
  genericTypes: string[] = [];
  specificTypes: string[] = [];
  typeFilter: string = 'Todas las Categorias';
  showNotification: boolean = false;
  notificationMessage: string = '';

  constructor(
    private clothesService: ClothesStockService,
    private imageService: ImageService,
    public notificationService: NotificationService,
    private meta: Meta,
    private title: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  async ngOnInit() {
    await this.loadClothes();
    this.title.setTitle('Clothes List - Clothing Store');

    let ogUrlContent = '';
    if (isPlatformBrowser(this.platformId)) {
      ogUrlContent = window.location.href;
    }

    this.meta.addTags([
      { name: 'description', content: 'Explore our list of available clothes in the store. Find the best clothes at the best prices.' },
      { name: 'keywords', content: 'clothes, clothing store, buy clothes, fashion, cheap clothes' },
      { name: 'robots', content: 'index, follow' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'author', content: GlobalConstants.storeName },
      { property: 'og:image', content: GlobalConstants.previewImageUrl },
      { property: 'og:url', content: ogUrlContent },
    ]);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedClothes'] && this.selectedClothes) {
      this.selectClothes(this.selectedClothes);
    }
  }

  async loadClothes(page: number = this.currentPage) {
    this.clothesService.findAll(page, 8).subscribe(clothes => {
      this.clothesList = clothes.clothes;
      this.pagination = clothes.pagination;
      this.genericTypes = [...new Set(clothes.clothes.map(clothe => clothe.getGenericType()))];
      this.specificTypes = [...new Set(clothes.clothes.map(clothe => clothe.getSpecificType()))];
    });
  }

  selectClothes(clothes: ClothesStock): void {
    this.selectedClothes = clothes;
    this.clothesForm.patchValue({
      name: clothes.getName(),
      price: clothes.getPrice(),
      code: clothes.getCode(),
      size: clothes.getSize(),
      description: clothes.getDescription(),
      stock: clothes.getStock(),
      genericType: clothes.getGenericType(),
      specificType: clothes.getSpecificType()
    });
    this.selectedImage = '';
    this.previewImage = '';
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    this.title.setTitle(`${clothes?.getName?.() || 'Clothing'} - Clothing Store`);
    this.meta.updateTag({ name: 'description', content: `Buy ${clothes?.getName?.() || 'Clothing'} at the best price. ${clothes?.getDescription?.() || ''}` });
  }

  hasMultipleImages(num: number): boolean {
    return (this.selectedClothes?.getImages()?.length ?? 0) > num;
  }

  updateClothes(): void {
    if (this.clothesForm.invalid) {
      this.notificationService.handleNotification('Por favor, complete todos los campos requeridos correctamente.', false);
      return;
    }

    if (this.selectedClothes) {
      const updatedClothes = { ...this.selectedClothes, ...this.clothesForm.value };
      const finallyClothe = {
        clothe: updatedClothes,
        subject: this.subject,
        message: this.message
      }
      this.clothesService.createUpdate(finallyClothe).subscribe(() => {
        this.selectedClothes = null;
        location.reload();
      });
    }
  }

  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      if (!this.imageService.validateImage(file)) {
        console.error('File is not an image.');
        return;
      }

      this.imageService.extractBase64(file).then((res: any) => {
        this.previewImage = res.base;
      });
    }
  }

  updateImage(): void {
    if (this.selectedClothes && this.previewImage) {
      const index = this.selectedClothes.getImages().findIndex(image => image.getUrl() === this.selectedImage);
      if (index > -1) {
        this.selectedClothes.getImages()[index].setUrl(this.previewImage);
        this.previewImage = '';
      }
    }
  }

  onImageClick(image: string): void {
    this.selectedImage = image;
  }

  addImage(): void {
    if (this.selectedClothes && this.selectedClothes.getImages().length < 3 && this.previewImage) {
      const newImage = new Image('', '');
      newImage.setId(`${this.getNextIdImage()}`);
      newImage.setUrl(this.previewImage);
      this.selectedClothes.getImages().push(newImage);
      this.previewImage = '';
    }
  }

  getNextIdImage(): number {
    if (this.lastImageId === 0) {
      this.selectedClothes?.getImages().forEach(image => {
        const imageId = Number(image.getId());
        if (imageId > this.lastImageId) {
          this.lastImageId = imageId;
        }
      });
    }
    return ++this.lastImageId;
  }

  deleteImage(imageUrl: string): void {
    if (this.selectedClothes && this.selectedClothes.getImages().length > 1) {
      this.selectedClothes.setImages(this.selectedClothes.getImages().filter(image => image.getUrl() !== imageUrl));
    }
  }

  scrollIntoView(options?: ScrollIntoViewOptions) {
    if (this.clothesListContainer) {
      this.clothesListContainer.nativeElement.scrollIntoView(options);
    }
  }

  onSpecificTypeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.clothesForm.patchValue({ specificType: input.value });
  }

  onGenericTypeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.clothesForm.patchValue({ genericType: select.value });
  }

  specificTypeValidator(control: AbstractControl): ValidationErrors | null {
    const genericType = control.get('genericType')?.value;
    const specificType = control.get('specificType')?.value;

    if (!this.genericTypes || !this.specificTypes) {
      return null;
    }

    const isNewGenericType = !this.genericTypes.includes(genericType);
    const isNewSpecificType = !this.specificTypes.includes(specificType);

    if (!isNewGenericType && !isNewSpecificType) {
      const validSpecificTypes = this.clothesList
        .filter(clothe => clothe.getGenericType() === genericType)
        .map(clothe => clothe.getSpecificType());

      if (genericType && specificType && !validSpecificTypes.includes(specificType)) {
        return { invalidSpecificType: true };
      }
    }
    return null;
  }

  trackByGenericType(index: number, genericType: string): string {
    return genericType;
  }

  trackBySpecificType(index: number, specificType: string): string {
    return specificType;
  }

  onImageError(event: Event) {
    this.imageService.handleImageError(event);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadClothes(page);
  }
}
