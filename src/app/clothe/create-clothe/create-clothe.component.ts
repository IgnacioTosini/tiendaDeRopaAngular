import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { ToastNotificationComponent } from '../../toast-notification/toast-notification.component';
import { ClothesStock } from '../../models/clothesStock.model';
import { ImageService } from '../../services/image.service';
import { ClothesStockService } from '../../services/clothes-stock.service';
import { Image } from '../../models/images.model';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-create-clothe',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, ToastNotificationComponent],
  templateUrl: './create-clothe.component.html',
  styleUrls: ['./create-clothe.component.scss']
})
export class CreateClotheComponent implements OnInit {
  clotheForm = new FormGroup({
    name: new FormControl('', Validators.required),
    price: new FormControl('', [Validators.required, Validators.min(0)]),
    stock: new FormControl('', [Validators.required, Validators.min(0)]),
    code: new FormControl('', Validators.required),
    size: new FormControl('', Validators.required),
    images: new FormArray([new FormControl('')]),
    description: new FormControl('', Validators.required),
    genericType: new FormControl('', Validators.required),
    specificType: new FormControl('', Validators.required),
    publicationDate: new FormControl('', Validators.required),
  });
  file: string[] = [];
  clothes: ClothesStock[] = [];
  lastImageId: number = 0;
  message: string = '';
  subject: string = '';
  showNotification: boolean = false;
  notificationMessage: string = '';
  typeOfNotification: boolean = false;

  constructor(
    private clothesStockService: ClothesStockService,
    private imageService: ImageService,
    private meta: Meta,
    private titleService: Title
  ) { }

  async ngOnInit() {
    await this.clothesStockService.findAll(0, 10).toPromise();
    this.clothes = this.clothesStockService.clothesArray;
    this.titleService.setTitle('Create New Clothe - Tienda de Ropa');
    this.meta.addTags([
      { name: 'description', content: 'Create a new clothe item in our online store. Fill out the form to add a new product to our catalog.' },
      { name: 'keywords', content: 'create clothe, new clothe, online store, clothing, fashion' },
      { name: 'robots', content: 'index, follow' }
    ]);
  }

  private handleNotification(message: string, isSuccess: boolean): void {
    this.notificationMessage = message;
    this.typeOfNotification = isSuccess;
    this.showNotification = true;
    setTimeout(() => {
      this.showNotification = false;
    }, 5000);
  }

  getNextId(): string {
    const maxId = Math.max(...this.clothes.map(clothe => Number(clothe.getId())), 0);
    return (maxId + 1).toString();
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
    // Check if the form is valid
    if (!this.clotheForm.valid) {
      this.handleNotification('Por favor, complete todos los campos requeridos.', false);
      return;
    }

    const formValue = this.clotheForm.value;
    let newId = this.getNextId();
    let date = new Date(this.clotheForm.value.publicationDate ?? '');
    let formattedDate = date.toISOString().slice(0, 10);

    // Convertir las URL de las imágenes en objetos Image
    const images = (this.clotheForm.value.images || []).map((imageUrl: any) => {
      const image = new Image('', '');
      image.setId(`${this.getNextIdImage()}`);
      image.setUrl(imageUrl?.url + '' || '../assets/photos/t-shirtChelsea.jpeg'); // Use default image if URL is empty
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
      []
    );

    const finallyClothe = {
      clothe: newClothe,
      subject: this.subject,
      message: this.message
    }

    this.clothesStockService.createUpdate(finallyClothe).subscribe({
      next: (response: HttpResponse<any>) => {
        console.log(response.status);
        this.handleNotification('Producto creado exitosamente.', true);
      },
      error: (err) => {
        console.error('Error al crear el producto:', err);
        this.handleNotification('Error al crear el producto.', false);
      }
    });
  }

  // Esta función se llama cuando el usuario selecciona un archivo
  onFileChange(event: any, index: number) {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      if (this.imageService.validateImage(file)) {
        this.imageService.extractBase64(file).then((image: any) => { // Use the ImageService to extract the base64
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
        });
      } else {
        this.imageService.handleImageError(event); // Handle invalid image format
      }
    }
  }

  addImageField() {
    const imagesControl = this.clotheForm.get('images') as FormArray;
    if (imagesControl.length < 3) {
      imagesControl.push(new FormControl(''));
      this.file.push('');
    }
  }

  removeImageField(index: number) {
    const imagesControl = this.clotheForm.get('images') as FormArray;
    imagesControl.removeAt(index);
    this.file.splice(index, 1);
  }

  get imageControls() {
    return (this.clotheForm.get('images') as FormArray).controls;
  }
}
