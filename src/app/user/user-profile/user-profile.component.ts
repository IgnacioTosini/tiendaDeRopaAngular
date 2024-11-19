import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastNotificationComponent } from '../../toast-notification/toast-notification.component';
import { PasswordFieldComponent } from '../../password/password-field/password-field.component';
import { User } from '../../models/user.model';
import { Tax } from 'mercadopago/dist/clients/commonTypes';
import { UserService } from '../../services/user.service';
import { ImageService } from '../../services/image.service';
import { TaxService } from '../../services/tax.service';
import { NotificationService } from '../../services/notification.service';
import { Meta, Title } from '@angular/platform-browser';
import { GlobalConstants } from '../../config/global-constants';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, ToastNotificationComponent, PasswordFieldComponent],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: User = new User(0, '', '', '', '', '', [], [], '');
  userForm: FormGroup = new FormGroup({});
  hidePassword = true;
  password: string = '';
  imageOpen: boolean = false;
  invoices: Tax[] = [];
  selectedInvoiceId: string = '';
  showNotification: boolean = false;
  notificationMessage: string = '';
  typeOfNotification: boolean = false;

  constructor(private fb: FormBuilder, private userService: UserService, private imageService: ImageService, private router: Router, private taxService: TaxService, public notificationService: NotificationService, private meta: Meta, private titleService: Title) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      image: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      invoiceCode: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit() {
    let user = this.userService.recoverUser();
    this.userService.getUserById(user.id || '').subscribe(
      response => {
        this.user.setId(response.id);
        this.user.setName(response.name);
        this.user.setLastname(response.lastname);
        this.user.setCellphone(response.tel);
        this.user.setImage(response.image);
        this.user.setEmail(response.email);
        this.user.setVip(response.vip);
        this.password = this.userService.getUserPassword();
        if (this.user) {
          this.userForm.patchValue({
            name: this.user.getName(),
            lastname: this.user.getLastname(),
            email: this.user.getEmail(),
            image: this.user.getImage(),
            password: this.password,
            invoiceCode: '0'
          });
        }
      },
      error => {
        console.error(error); // Imprime el error en la consola si hay uno
      }
    );
    this.titleService.setTitle('User Profile - Your Store Name');
    this.meta.addTags([
      { name: 'description', content: 'View and update your user profile details on Your Store Name.' },
      { name: 'keywords', content: 'user profile, update details, Your Store Name' },
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: GlobalConstants.storeName },
      { property: 'og:image', content: GlobalConstants.previewImageUrl },
      { property: 'og:url', content: window.location.href },
    ]);
  }

  private handleNotification(message: string, isSuccess: boolean): void {
    this.notificationService.handleNotification(message, isSuccess);
  }

  updateUserDetails(event: Event) {
    event.preventDefault();

    if (this.userForm.invalid) {
      this.handleNotification(this.getErrorMessage(), false);
      return;
    }

    // Verificar si se han realizado cambios
    if (!this.userForm.dirty) {
      this.handleNotification('No se han realizado cambios.', false);
      return;
    }

    const updatedUser = new User(
      this.user.getId(),
      this.userForm?.get('name')?.value,
      this.userForm?.get('lastname')?.value,
      this.user.getCellphone(),
      this.user.getImage(),
      this.userForm?.get('email')?.value,
      this.user.getWisheList(),
      this.user.getComments(),
      this.user.getVip(),
    );

    const newPassword = this.userForm?.get('password')?.value;
    console.log('Usuario actualizado:', updatedUser);
    console.log('Nueva contraseña:', newPassword);

    // Actualizar los detalles del usuario
    this.userService.updateUser(updatedUser).subscribe(
      (response: any) => {
        console.log(response);
        // Si la actualización del usuario fue exitosa, actualizar la contraseña
        this.userService.updatePassword(String(this.user.getId()), newPassword).subscribe(
          (response: any) => {
            console.log(response);
            this.handleNotification('Detalles del usuario actualizados exitosamente.', true);
            this.userForm.markAsPristine(); // Marcar el formulario como no sucio
            this.router.navigate(["/user-profile"]).then(() => {
              window.location.reload();
            });
          },
          (error: any) => {
            console.error('Ocurrió un error al actualizar la contraseña:', error);
            this.handleNotification('Ocurrió un error al actualizar la contraseña.', false);
          }
        );
      },
      (error: any) => {
        console.error('Ocurrió un error al actualizar el usuario:', error);
        this.handleNotification('Ocurrió un error al actualizar el usuario.', false);
      }
    );
  }

  updateImage(event: any) {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      if (!this.imageService.validateImage(file)) {
        console.error('File is not an image.');
        this.handleNotification('El archivo no es una imagen válida.', false);
        return;
      }

      this.imageService.extractBase64(file).then((image: any) => {
        this.user?.setImage(image.base);
        this.userForm.markAsDirty(); // Marcar el formulario como sucio
        this.userService.updateUser(this.user).subscribe(() => {
          this.router.navigate(["/user-profile"]).then(() => {
            window.location.reload();
          });
        });
      })
    }
  }

  openImage() {
    this.imageOpen = !this.imageOpen;
  }

  findByCode(): void {
    this.userService.getUserById(this.userForm?.get('invoiceCode')?.value).subscribe(
      data => {
        console.log(data);
        if (data.invoiceCode) {
          this.invoices = [data];
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  findAll(): void {
    this.taxService.findAllTaxUser(this.user.getId(), 0, 10).subscribe(
      data => {
        console.log(data);
        this.invoices = data;
      },
      error => {
        console.error(error);
      }
    );
  }

  getErrorMessage(): string {
    if (this.userForm.controls['email'].errors) {
      return 'El campo Correo Electrónico no está completo o es incorrecto';
    }
    if (this.userForm.controls['password'].errors) {
      return 'El campo Contraseña no está completo o es incorrecto';
    }
    if (this.userForm.controls['name'].errors) {
      return 'El campo Nombre no está completo o es incorrecto';
    }
    if (this.userForm.controls['lastname'].errors) {
      return 'El campo Apellido no está completo o es incorrecto';
    }
    return 'Por favor, complete todos los campos requeridos correctamente.';
  }

  get passwordControl(): FormControl {
    return this.userForm.get('password') as FormControl;
  }
}
