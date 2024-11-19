import { Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Meta } from '@angular/platform-browser';
import { GlobalConstants } from '../../config/global-constants';

@Component({
  selector: 'app-password-field',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './password-field.component.html',
  styleUrls: ['./password-field.component.scss']
})
export class PasswordFieldComponent {
  @Input() control!: FormControl;
  hidePassword = true;

  constructor(private meta: Meta) {
    this.meta.addTags([
      { name: 'description', content: 'Secure password input field with toggle visibility feature' },
      { name: 'keywords', content: 'password, input, toggle, visibility, secure' },
      { name: 'author', content: GlobalConstants.storeName },
      { property: 'og:image', content: GlobalConstants.previewImageUrl },
      { property: 'og:url', content: window.location.href },
    ]);
  }
}
