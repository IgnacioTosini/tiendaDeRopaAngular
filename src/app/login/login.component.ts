import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ToastNotificationComponent } from '../toast-notification/toast-notification.component';
import { PasswordFieldComponent } from '../password-field/password-field.component';
import { NotificationService } from '../services/notification.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, ToastNotificationComponent, PasswordFieldComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  showNotification: boolean = false;
  notificationMessage: string = '';
  notificationDuration: number = 5000; // Duración de la notificación en milisegundos

  constructor(private formBuilder: FormBuilder, private userService: UserService, private authService: AuthService, public notificationService: NotificationService, private meta: Meta, private title: Title) { }

  ngOnInit(): void {
    this.title.setTitle('Login - Your Store Name');
    this.meta.addTags([
      { name: 'description', content: 'Login to access your account and start shopping at Store.' },
      { name: 'keywords', content: 'login, user login, account access' },
      { name: 'robots', content: 'index, follow' }
    ]);
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (!this.loginForm.valid) {
      this.notificationService.handleNotification(this.getErrorMessage(), false);
      return;
    }

    this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe(response => {
      console.log('User:', response);
      if (response) {
        this.userService.getUserByEmail(response.username, response.token).subscribe(user => {
          console.log(user);
          this.authService.handleLoginResponse(response);
        }, error => {
          console.error('Error fetching user by email:', error);
        });
      } else {
        console.log('User not found');
      }
    }, error => {
      this.showNotification = true;
      this.notificationMessage = 'El correo electrónico o la contraseña son incorrectos.';
      setTimeout(() => {
        this.showNotification = false;
      }, this.notificationDuration);
      console.error('Login error:', error);
    });
  }

  getErrorMessage(): string {
    if (this.loginForm.controls['email'].errors) {
      return 'El campo Correo Electrónico no está completo o es incorrecto';
    }
    if (this.loginForm.controls['password'].errors) {
      return 'El campo Contraseña no está completo o es incorrecto';
    }
    return 'Por favor, complete todos los campos requeridos correctamente.';
  }

  get passwordControl(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }
}
