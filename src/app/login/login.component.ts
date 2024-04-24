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
  isLoggedIn = false;

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
          this.AuthService.login(user.email); // Añade esta línea
        } else {
          // El usuario no existe
          console.log('Usuario no encontrado');
        }
      });
    }
  }
}
