import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  userForm: FormGroup = new FormGroup({});
  file: string = '';

  constructor(private userService: UserService, private formBuilder: FormBuilder, private sanitizer: DomSanitizer) {
    this.userForm = this.formBuilder.group({
      id: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      lastname: ['', Validators.required],
      image: ['', Validators.required],
      name: ['', Validators.required],
      tel: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Rest of the code...
  }

  // Esta función se llama cuando el usuario selecciona un archivo
  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      this.extraerBase64(event).then((image: any) => {
        // Guarda la cadena base64 de la imagen en el campo 'image' del formulario
        this.userForm.get('image')?.patchValue(image.base);
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

  createUser(): void {
    if (this.userForm.valid) {
      this.userService.createUser(this.userForm.value)
        .subscribe(response => {
          console.log(response);
        });
    }
  }

  updateUserPassword(): void {
    if (this.userForm.valid) {
      this.userService.updatePassword(this.userForm.value.id, this.userForm.value.password)
        .subscribe(response => {
          console.log(response);
        });
    }
  }

  getUserById(): void {
    this.userService.getUserById(this.userForm.value.id)
      .subscribe(response => {
        console.log(response);
      });
  }

  getUserByEmail(): void {
    this.userService.getUserByEmail(this.userForm.value.email)
      .subscribe(response => {
        console.log(response);
      });
  }

  getUsersByLastname(): void {
    this.userService.getUsersByLastname(this.userForm.value.lastname)
      .subscribe(response => {
        console.log(response);
      });
  }
}
