import { NotificationService } from './../../services/notification.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordService } from '../../services/password.service';
import { RestorePasswordData } from '../../models/restorePasswordData';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { ToastNotificationComponent } from '../../toast-notification/toast-notification.component';

@Component({
  selector: 'app-password-reset-component',
  standalone: true,
  imports: [ReactiveFormsModule, ToastNotificationComponent],
  templateUrl: './password-reset-component.component.html',
  styleUrl: './password-reset-component.component.scss'
})
export class PasswordResetComponentComponent implements OnInit {
  resetForm: FormGroup = new FormGroup({});
  showNotification: boolean = false;
  notificationMessage: string = '';

  constructor(private formBuilder: FormBuilder, private passwordService: PasswordService, public notificationService: NotificationService, private router: Router, private meta: Meta, private title: Title) { }

  ngOnInit(): void {
    this.title.setTitle('Reset Your Password - YourAppName');
    this.meta.addTags([
      { name: 'description', content: 'Reset your password to regain access to your account.' },
      { name: 'keywords', content: 'password reset, account recovery, new password' }
    ]);
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      code: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (!this.resetForm.valid) {
      this.notificationService.handleNotification(this.getErrorMessage(), false);
      return;
    }
    if (!this.resetForm.valid) {
      this.notificationMessage = 'Please fill out all fields correctly.';
      this.showNotification = true;
      return;
    }

    const restorePasswordData = new RestorePasswordData(
      this.resetForm.value.email,
      this.resetForm.value.code,
      this.resetForm.value.password
    );

    this.passwordService.changePassword(restorePasswordData).subscribe(response => {
      this.notificationMessage = 'Password changed successfully.';
      this.showNotification = true;
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 3000);
    }, error => {
      this.notificationMessage = 'Error changing password.';
      this.showNotification = true;
      console.error('Password reset error:', error);
    });
  }

  getErrorMessage(): string {
    if (this.resetForm.controls['email'].errors) {
      return 'El campo Correo Electrónico no está completo o es incorrecto';
    }
    if (this.resetForm.controls['password'].errors) {
      return 'El campo Contraseña no está completo o es incorrecto';
    }
    if (this.resetForm.controls['code'].errors) {
      return 'El campo code no está completo o es incorrecto';
    }
    return 'Por favor, complete todos los campos requeridos correctamente.';
  }
}

