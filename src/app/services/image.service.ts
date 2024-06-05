import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private sanitizer: DomSanitizer) { }

  validateImage(file: File): boolean {
    return file.type.startsWith('image/');
  }

  extractBase64(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const unsafeImg = window.URL.createObjectURL(file);
        const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          resolve({
            base: reader.result
          });
        };
        reader.onerror = error => {
          resolve({
            base: null
          });
        };
      } catch (error) {
        reject(error);
      }
    });
  }
}
