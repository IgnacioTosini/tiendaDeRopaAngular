import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
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
import { isPlatformBrowser } from '@angular/common';

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

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private imageService: ImageService,
    private router: Router,
    private taxService: TaxService,
    public notificationService: NotificationService,
    private meta: Meta,
    private titleService: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
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
    this.titleService.setTitle('User Profile - Your Store Name');

    let ogUrlContent = '';
    if (isPlatformBrowser(this.platformId)) {
      ogUrlContent = window.location.href;
    }

    this.meta.addTags([
      { name: 'description', content: 'View and update your user profile details on Your Store Name.' },
      { name: 'keywords', content: 'user profile, update details, Your Store Name' },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:image', content: GlobalConstants.previewImageUrl },
      { property: 'og:url', content: ogUrlContent },
    ]);
  }
}
