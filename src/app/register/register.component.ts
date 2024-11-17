import { UserService } from '../services/user.service';
import { ImageService } from '../services/image.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastNotificationComponent } from '../toast-notification/toast-notification.component';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { Meta } from '@angular/platform-browser';
const DefaultImageUser = '../../assets/photos/person.svg';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [ReactiveFormsModule, ToastNotificationComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  userForm: FormGroup = new FormGroup({});
  file: string = '';
  showNotification: boolean = false;
  notificationMessage: string = '';

  constructor(private userService: UserService, private formBuilder: FormBuilder, private imageService: ImageService, private router: Router, public notificationService: NotificationService, private meta: Meta) {
    this.userForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.email]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      image: [DefaultImageUser],
      name: ['', [Validators.required, Validators.minLength(2)]],
      tel: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]], // Validación para un número de teléfono de 10 dígitos
    });

    this.meta.addTags([
      { name: 'description', content: 'Register a new user to access our clothing store.' },
      { name: 'keywords', content: 'register, user, clothing store, sign up' },
      { name: 'robots', content: 'index, follow' }
    ]);
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

  createNewUser(): void {
    // Verificar si el formulario es válido
    if (!this.userForm.valid) {
      this.notificationService.handleNotification(this.getErrorMessage(), false);
      return;
    }
    console.log(this.userForm.value.password);
    this.userService.register(this.userForm.value).subscribe(response => {
      console.log(response);
      this.router.navigate(["/login"]).then(() => {
        window.location.reload();
      });
    });
  }

  getErrorMessage(): string {
    if (this.userForm.controls['name'].errors) {
      return 'El campo Nombre no está completo o es incorrecto';
    }
    if (this.userForm.controls['lastname'].errors) {
      return 'El campo Apellido no está completo o es incorrecto';
    }
    if (this.userForm.controls['email'].errors) {
      return 'El campo Correo Electrónico no está completo o es incorrecto';
    }
    if (this.userForm.controls['password'].errors) {
      return 'El campo Contraseña no está completo o es incorrecto';
    }
    if (this.userForm.controls['tel'].errors) {
      return 'El campo Teléfono no está completo o es incorrecto';
    }
    return 'Por favor, complete todos los campos requeridos correctamente.';
  }
}
