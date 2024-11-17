import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  constructor(private meta: Meta, private title: Title) {
    this.title.setTitle('Footer - Clothing Store');
    this.meta.addTags([
      { name: 'description', content: 'Footer of the clothing store with contact information and social media links.' },
      { name: 'keywords', content: 'footer, clothing store, contact, social media, fashion, online store' },
      { name: 'author', content: 'Clothing Store' },
      { name: 'robots', content: 'index, follow' }
    ]);
  }
}
