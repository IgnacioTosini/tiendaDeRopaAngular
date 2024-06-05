import { ImageService } from './../services/image.service';
import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  user: User = new User('', '', '', '', '', '');
  userForm: FormGroup = new FormGroup({});
  hidePassword = true;
  password: string = '';

  constructor(private fb: FormBuilder, private UserService: UserService, private imageService: ImageService, private router: Router) {
    this.userForm = this.fb.group({
      name: [{ value: '' }, [Validators.required, Validators.minLength(2)]],
      lastname: [{ value: '' }, [Validators.required, Validators.minLength(2)]],
      email: [{ value: '' }, [Validators.required, Validators.email]],
      image: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit() {
    let token = localStorage.getItem("token");
    this.UserService.getUserById(token || '').subscribe(
      response => {
        this.user.setId(response.id);
        this.user.setName(response.name);
        this.user.setLastname(response.lastname);
        this.user.setCellphone(response.tel);
        this.user.setImage(response.image);
        this.user.setEmail(response.email);
        this.password = this.UserService.getUserPassword()
        if (this.user) {
          this.userForm.setValue({
            name: { value: this.user.getName(), disabled: false },
            lastname: { value: this.user.getLastname(), disabled: false },
            email: { value: this.user.getEmail(), disabled: false },
            image: this.user.getImage(),
            password: this.password
          });
        }
      },
      error => {
        console.error(error); // Imprime el error en la consola si hay uno
      }
    );
  }

  updateUserDetails() {
    const updatedUser = new User(
      this.user.getId(),
      this.userForm?.get('name')?.value,
      this.userForm?.get('lastname')?.value,
      this.userForm?.get('tel')?.value,
      this.user.getImage(),
      this.userForm?.get('email')?.value
    );

    const newPassword = this.userForm?.get('password')?.value;

    // Actualizar los detalles del usuario
    this.UserService.updateUser(updatedUser).subscribe(
      (response: any) => {
        console.log(response);
        // Si la actualización del usuario fue exitosa, actualizar la contraseña
        this.UserService.updatePassword(String(this.user.getId()), newPassword).subscribe(
          (response: any) => {
            console.log(response);
            this.router.navigate(["/user-profile"]).then(() => {
              window.location.reload();
            });
          },
          (error: any) => {
            console.error(error);
          }
        );
      },
      (error: any) => {
        console.error(error);
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
        this.UserService.updateUser(this.user).subscribe(() => {
          this.router.navigate(["/user-profile"]).then(() => {
            window.location.reload();
          });
        });
      })
    }
  }
}
