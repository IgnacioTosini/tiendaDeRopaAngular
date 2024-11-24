import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { GalleryComponent } from '../../product/gallery/gallery.component';
import { GlobalConstants } from '../../config/global-constants';
import { CarouselComponent } from '../../product/carousel/carousel.component';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [CarouselComponent, GalleryComponent]
})
export class HomeComponent implements OnInit {
  constructor(private meta: Meta, private title: Title, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    this.title.setTitle('Home - Clothing Store');

    let ogUrlContent = '';
    if (isPlatformBrowser(this.platformId)) {
      ogUrlContent = window.location.href;
    }

    this.meta.addTags([
      { name: 'description', content: 'Welcome to our clothing store. Discover the latest trends in fashion and shop your favorite items.' },
      { name: 'keywords', content: 'clothing, fashion, store, shop, trends, apparel' },
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: GlobalConstants.storeName },
      { property: 'og:image', content: GlobalConstants.previewImageUrl },
      { property: 'og:url', content: ogUrlContent },
    ]);
  }
}
