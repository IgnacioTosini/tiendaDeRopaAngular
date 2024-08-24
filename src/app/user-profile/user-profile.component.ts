import { TaxService } from './../services/tax.service';
import { ImageService } from './../services/image.service';
import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { Tax } from '../models/tax.model';
import { InvoiceComponent } from '../invoice/invoice.component';
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, InvoiceComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  user: User = new User(0, '', '', '', '', '', [], [], '');
  userForm: FormGroup = new FormGroup({});
  hidePassword = true;
  password: string = '';
  imageOpen: boolean = false;
  invoices: Tax[] = [];
  selectedInvoiceId: string = '';

  constructor(private fb: FormBuilder, private userService: UserService, private imageService: ImageService, private router: Router, private taxService: TaxService) {
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
  }

  updateUserDetails() {
    // Verificar si el formulario es válido
    if (this.userForm.invalid) {
      console.error('El formulario no es válido');
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
            this.router.navigate(["/user-profile"]).then(() => {
              window.location.reload();
            });
          },
          (error: any) => {
            // Aquí puedes manejar el error como quieras. Por ejemplo, podrías mostrar un mensaje de error al usuario.
            console.error('Ocurrió un error al actualizar la contraseña:', error);
          }
        );
      },
      (error: any) => {
        // Aquí puedes manejar el error como quieras. Por ejemplo, podrías mostrar un mensaje de error al usuario.
        console.error('Ocurrió un error al actualizar el usuario:', error);
      }
    );
  }

  updateImage(event: any) {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      if (!this.imageService.validateImage(file)) {
        console.error('File is not an image.');
        return;
      }

      this.imageService.extractBase64(file).then((image: any) => {
        this.user?.setImage(image.base);
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

  selectInvoice(invoiceId: string) {
    this.selectedInvoiceId = invoiceId;
  }

  verTodasLasFacturas() {
    this.findAll();
  }

  verFacturaPorId() {
    this.findByCode();
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
    this.taxService.findAllTaxUser(this.user.getId()).subscribe(
      data => {
        console.log(data);
        this.invoices = data;
      },
      error => {
        console.error(error);
      }
    );
  }
}
