import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-toast-notification',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './toast-notification.component.html',
  styleUrls: ['./toast-notification.component.scss']
})
export class ToastNotificationComponent implements OnInit {
  @Input() message: string = '';
  @Input() duration: number = 3000; // Duración predeterminada de 3 segundos
  @Input() imageUrl?: string;
  @Input() imagePosition: 'side' | 'below' = 'side'; // Posición de la imagen
  @Input() isSuccess: boolean = true; // Determina si la notificación es de éxito
  isVisible: boolean = false;

  constructor(library: FaIconLibrary) {
    library.addIcons(faCheckCircle, faTimesCircle);
  }

  ngOnInit(): void {
    this.showNotification();
  }

  showNotification(): void {
    this.isVisible = true;
    setTimeout(() => {
      this.isVisible = false;
    }, this.duration);
  }
}
