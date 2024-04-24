import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../models/user.model';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  user: User | undefined; // Aquí debes obtener el usuario actual
  userForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    // Aquí debes inicializar el usuario actual
    this.userForm = this.fb.group({
      name: [{ value: this.user?.getName(), disabled: true }],
      lastname: [{ value: this.user?.getLastname(), disabled: true }],
      email: [{ value: this.user?.getEmail(), disabled: true }],
      image: [this.user?.getImage(), Validators.required],
      password: ['', Validators.required]
    });
  }

  updatePassword() {
    const newPassword = this.userForm?.get('password')?.value;
    // Aquí debes implementar la lógica para actualizar la contraseña del usuario
  }

  updateImage() {
    const newImage = this.userForm?.get('image')?.value;
    this.user?.setImage(newImage);
    // Aquí debes implementar la lógica para actualizar la imagen del usuario
  }
}
