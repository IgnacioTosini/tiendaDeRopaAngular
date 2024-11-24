import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastNotificationComponent } from '../../toast-notification/toast-notification.component';
import { PasswordFieldComponent } from '../../password/password-field/password-field.component';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { GlobalConstants } from '../../config/global-constants';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, ToastNotificationComponent, PasswordFieldComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    public notificationService: NotificationService,
    private meta: Meta,
    private title: Title,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Login - Your Store Name');

    let ogUrlContent = '';
    if (isPlatformBrowser(this.platformId)) {
      ogUrlContent = window.location.href;
    }

    this.meta.addTags([
      { name: 'description', content: 'Login to access your account and start shopping at Store.' },
      { name: 'keywords', content: 'login, user login, account access' },
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: GlobalConstants.storeName },
      { property: 'og:image', content: GlobalConstants.previewImageUrl },
      { property: 'og:url', content: ogUrlContent },
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
      this.notificationService.handleNotification('El correo electrónico o la contraseña son incorrectos.', false);
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

  navigateToPasswordReset(): void {
    this.router.navigate(['/sendEmail']);
  }
}
