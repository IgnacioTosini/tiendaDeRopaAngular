import { Component, OnInit } from '@angular/core';
import { ClothesStockService } from '../services/clothes-stock.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpResponse } from '@angular/common/http';
import { ClothesStock } from '../models/clothesStock.model';

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
    image: new FormControl(''),
    description: new FormControl(''),
    genericType: new FormControl(''),
    specificType: new FormControl(''),
    publicationDate: new FormControl(''),
  });
  file: string = '';

  constructor(private clothesStockService: ClothesStockService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
  }

  /* getNextId(): number {
    const maxId = Math.max(...this.clothes.map(clothe => clothe.id), 0);
    return maxId + 1;
  } */

  createClothe() {
    const formValue = this.clotheForm.value;
    const newId = 0 /* this.getNextId(); */
    let date = new Date(this.clotheForm.value.publicationDate ?? '');
    let formattedDate = date.toISOString().slice(0, 10);
    const newClothe = new ClothesStock(
      newId,
      formValue.name || '',
      Number(formValue.price) || 0,
      formValue.code || '',
      formValue.size || '',
      formValue.image || '',
      formValue.description || '',
      formValue.genericType || '',
      formValue.specificType || '',
      formattedDate, // La fecha ya está en el formato yyyy-MM-dd
      Number(formValue.stock) || 0,
    );

    this.clothesStockService.createUpdate(newClothe).subscribe(() => {
      (response: HttpResponse<any>) => {
        console.log(response.status);
      }
    });
  }

    // Esta función se llama cuando el usuario selecciona un archivo
onFileChange(event: any) {
  if (event.target.files && event.target.files.length) {
    this.extraerBase64(event).then((image: any) => {
      // Guarda la cadena base64 de la imagen en el campo 'image' del formulario
      this.clotheForm.get('image')?.patchValue(image.base);
      this.file = image.base;
    })
  }
}

    // Define la función como una función asíncrona que devuelve una promesa
    extraerBase64 = async ($event: any) => new Promise((resolve, reject) => {
      try {
        // Obtiene el primer archivo seleccionado por el usuario
        const file = $event.target.files[0];
        // Crea un URL de objeto para el archivo
        const unsafeImg = window.URL.createObjectURL(file);
        // Sanitiza el URL de objeto para usarlo en la plantilla
        const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
        // Crea un nuevo FileReader para leer el archivo
        const reader = new FileReader();
        // Inicia la lectura del archivo como un URL de datos
        reader.readAsDataURL(file);
        // Cuando la lectura se completa, resuelve la promesa con el resultado
        reader.onload = () => {
          resolve({
            base: reader.result
          });
        };
        // Si ocurre un error durante la lectura, resuelve la promesa con null
        reader.onerror = error => {
          resolve({
            base: null
          });
        };
      } catch (error) {
        // Si ocurre un error durante la ejecución, rechaza la promesa con el error
        reject(error);
      }
    });

}
