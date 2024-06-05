import { AuthService } from './../services/auth.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({});

  constructor(private formBuilder: FormBuilder, private userService: UserService, private AuthService: AuthService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.userService.getUserByEmail(this.loginForm.value.email).subscribe(user => {
        if (user) {
          // El usuario existe, puedes continuar con la verificación de la contraseña
          console.log('Usuario encontrado:', user);
          if (this.loginForm.value.password === this.userService.getUserPassword()) {
            // La contraseña es correcta, puedes continuar con el inicio de sesión
            console.log('Contraseña correcta');
            this.AuthService.login(user.getEmail());
          } else {
            // La contraseña es incorrecta
            console.log('Contraseña incorrecta');
          }
        } else {
          // El usuario no existe
          console.log('Usuario no encontrado');
        }
      });
    }
  }
}
