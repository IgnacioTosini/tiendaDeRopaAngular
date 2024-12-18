import { NotificationService } from './../../services/notification.service';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { PasswordService } from '../../services/password.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastNotificationComponent } from '../../toast-notification/toast-notification.component';
import { GlobalConstants } from '../../config/global-constants';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-send-password-request',
  standalone: true,
  imports: [ReactiveFormsModule, ToastNotificationComponent],
  templateUrl: './send-password-request.component.html',
  styleUrls: ['./send-password-request.component.scss']
})
export class SendPasswordRequestComponent implements OnInit {
  resetForm: FormGroup;
  showNotification: boolean = false;
  notificationMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private passwordService: PasswordService,
    public notificationService: NotificationService,
    private router: Router,
    private meta: Meta,
    private title: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.title.setTitle('Send Password Reset Request - YourAppName');

    let ogUrlContent = '';
    if (isPlatformBrowser(this.platformId)) {
      ogUrlContent = window.location.href;
    }

    this.meta.addTags([
      { name: 'description', content: 'Send a password reset request to regain access to your account.' },
      { name: 'keywords', content: 'password reset, account recovery, email reset' },
      { name: 'author', content: GlobalConstants.storeName },
      { property: 'og:image', content: GlobalConstants.previewImageUrl },
      { property: 'og:url', content: ogUrlContent },
    ]);
  }

  sendEmailPassword(): void {
    if (!this.resetForm.valid) {
      this.notificationService.handleNotification(this.getErrorMessage(), false);
      return;
    }
    if (!this.resetForm.controls['email'].valid) {
      this.notificationMessage = 'Please enter a valid email.';
      this.showNotification = true;
      return;
    }

    this.passwordService.sendEmailPassword(this.resetForm.value.email).subscribe(response => {
      this.notificationMessage = 'Email sent successfully. Please check your inbox for the code.';
      this.showNotification = true;
      setTimeout(() => {
        this.router.navigate(['/password-reset']);
      }, 3000);
    }, error => {
      this.notificationMessage = 'Error sending email.';
      this.showNotification = true;
      console.error('Email send error:', error);
    });
  }

  getErrorMessage(): string {
    if (this.resetForm.controls['email'].errors) {
      return 'El campo Correo Electrónico no está completo o es incorrecto';
    }
    return 'Por favor, complete todos los campos requeridos correctamente.';
  }
}
