import { Component, OnInit } from '@angular/core';
import { ClothesStock } from '../models/clothesStock.model';
import { ClothesStockService } from '../services/clothes-stock.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ImageService } from '../services/image.service';

@Component({
  selector: 'app-clothes-list',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './clothes-list.component.html',
  styleUrl: './clothes-list.component.scss'
})
export class ClothesListComponent implements OnInit {
  clothesList: ClothesStock[] = [];
  selectedClothes: ClothesStock | null = null;
  selectedImage: string = '';
  previewImage: string = '';
  clothesForm = new FormGroup({
    name: new FormControl('', Validators.required),
    price: new FormControl(0, [Validators.required, Validators.min(0)]),
    code: new FormControl('', Validators.required),
    size: new FormControl('', Validators.required),
    // Add more controls as needed
  });

  constructor(private clothesService: ClothesStockService, private imageService: ImageService) { }

  ngOnInit(): void {
    this.clothesService.findAll().subscribe(clothes => {
      this.clothesList = clothes;
      console.log(this.clothesList);
    });
  }

  selectClothes(clothes: ClothesStock): void {
    this.selectedClothes = clothes;
    this.clothesForm.setValue({
      name: clothes.getName(),
      price: clothes.getPrice(),
      code: clothes.getCode(),
      size: clothes.getSize(),
    });
    this.selectedImage = '';
    this.previewImage = '';
    // Resetear el input file
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  updateClothes(): void {
    if (this.selectedClothes) {
      const updatedClothes = { ...this.selectedClothes, ...this.clothesForm.value };
      console.log(updatedClothes);
      this.clothesService.createUpdate(updatedClothes).subscribe(() => {
        this.selectedClothes = null;
        location.reload(); // Recarga la página
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
        this.previewImage = res.base; // Update the preview image
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
}
