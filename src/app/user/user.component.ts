import { UserService } from './../services/user.service';
import { ImageService } from './../services/image.service'; // Importa el servicio de imagen
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../models/user.model';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  userForm: FormGroup = new FormGroup({});
  file: string = '';

  constructor(private userService: UserService, private formBuilder: FormBuilder, private imageService: ImageService) { // Inyecta el servicio de imagen
    this.userForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.email]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      image: ['', Validators.required],
      name: ['', [Validators.required, Validators.minLength(2)]],
      tel: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]], // Validación para un número de teléfono de 10 dígitos
    });
  }

  // Esta función se llama cuando el usuario selecciona un archivo
  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      if (!this.imageService.validateImage(file)) {
        console.error('File is not an image.');
        return;
      }

      this.imageService.extractBase64(file).then((image: any) => {
        // Guarda la cadena base64 de la imagen en el campo 'image' del formulario
        this.userForm.get('image')?.patchValue(image.base);
        this.file = image.base;
      })
    }
  }

  getMaxId(users: User[]): number {
    let maxId = 0;
    users.forEach((user: User) => {
      const userId = Number(user.getId());
      if (user instanceof User && userId > maxId) {
        maxId = userId;
      }
    });
    return maxId;
  }

  createNewUser(newUser: any): void {
    this.userService.createUser(newUser).subscribe(response => {
      console.log(response);
    });
  }

  createUser(): void {
    if (this.userForm.valid) {
      this.userService.getUsers().subscribe(users => {
        console.log(users);
        // Encuentra el ID más grande
        const maxId = this.getMaxId(users);

        // Asigna un nuevo ID que es el ID más grande + 1
        const newUser = this.userForm.value;
        newUser.id = maxId + 1;

        // Crea el nuevo usuario
        this.createNewUser(newUser);
      });
    }
  }
}
