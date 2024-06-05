import { ClothesStockService } from './../services/clothes-stock.service';
import { ImageService } from './../services/image.service'; // Import the ImageService
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { ClothesStock } from '../models/clothesStock.model';
import { Image } from '../models/images.model';

@Component({
  selector: 'app-create-clothe',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-clothe.component.html',
  styleUrl: './create-clothe.component.scss'
})
export class CreateClotheComponent implements OnInit {
  clotheForm = new FormGroup({
    name: new FormControl(''),
    price: new FormControl(''),
    stock: new FormControl(''),
    code: new FormControl(''),
    size: new FormControl(''),
    images: new FormArray([new FormControl('')]),
    description: new FormControl(''),
    genericType: new FormControl(''),
    specificType: new FormControl(''),
    publicationDate: new FormControl(''),
  });
  file: string[] = [];
  clothes: ClothesStock[] = []; // Modificado para ser un arreglo de Clothes
  lastImageId: number = 0;

  constructor(private clothesStockService: ClothesStockService, private imageService: ImageService) { } // Inject the ImageService

  async ngOnInit() {
    await this.clothesStockService.findAll().toPromise();
    this.clothes = this.clothesStockService.clothesArray;
  }

  getNextId(): string {
    const maxId = Math.max(...this.clothes.map(clothe => Number(clothe.getId())), 0);
    maxId + 1;
    return maxId.toString();
  }

  getNextIdImage(): number {
    if (this.lastImageId === 0) {
      this.clothes.forEach(clothe => {
        clothe.getImages().forEach(image => {
          const imageId = Number(image.getId());
          if (imageId > this.lastImageId) {
            this.lastImageId = imageId;
          }
        });
      });
    }
    return ++this.lastImageId;
  }

  createClothe() {
    const formValue = this.clotheForm.value;
    let newId = this.getNextId();
    let date = new Date(this.clotheForm.value.publicationDate ?? '');
    let formattedDate = date.toISOString().slice(0, 10);

    // Convertir las URL de las imágenes en objetos Image
    const images = (this.clotheForm.value.images || []).map((imageUrl: any) => {
      const image = new Image('', '');
      image.setId(`${this.getNextIdImage()}`);
      image.setUrl(imageUrl?.url + '' || '');
      return image;
    });

    const newClothe = new ClothesStock(
      newId,
      formValue.name || '',
      Number(formValue.price) || 0,
      formValue.code || '',
      formValue.size || '',
      images,
      formValue.description || '',
      formValue.genericType || '',
      formValue.specificType || '',
      formattedDate,
      Number(formValue.stock) || 0,
    );

    this.clothesStockService.createUpdate(newClothe).subscribe(() => {
      (response: HttpResponse<any>) => {
        console.log(response.status);
      }
    });
  }

  // Esta función se llama cuando el usuario selecciona un archivo
  onFileChange(event: any, index: number) {
    if (event.target.files && event.target.files.length) {
      this.imageService.extractBase64(event.target.files[0]).then((image: any) => { // Use the ImageService to extract the base64
        // Crear una nueva instancia de Image
        const newImage = new Image('', '');
        // Establecer el id y la url de la imagen
        newImage.setId(`image-${index}`);
        newImage.setUrl(image.base);
        // Guardar la imagen en el campo 'images' del formulario
        let imagesControl = (this.clotheForm.get('images') as FormArray).controls[index];
        if (imagesControl) {
          imagesControl.patchValue(newImage);
        }
        this.file[index] = image.base;
      })
    }
  }

  addImageField() {
    const imagesControl = this.clotheForm.get('images');
    if (imagesControl && imagesControl.value && imagesControl.value.length < 3) {
      (imagesControl as FormArray).push(new FormControl(''));
      this.file.push('');
    }
  }
}
