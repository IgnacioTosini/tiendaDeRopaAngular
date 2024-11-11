import { trigger, transition, style, animate, keyframes, query, stagger } from '@angular/animations';

export const slideInOutLeft = trigger('slideInOutLeft', [
  transition(':enter', [
    style({ transform: 'translateX(-100%)' }), // Empieza fuera de la vista, a la izquierda
    animate('0.5s ease', style({ transform: 'translateX(0)' })) // Anima hacia la posición original
  ]),
  transition(':leave', [
    animate('0.5s ease', style({ transform: 'translateX(-100%)' })) // Anima hacia fuera de la vista, a la izquierda
  ])
]);

export const slideInOutRight = trigger('slideInOutRight', [
  transition(':enter', [
    style({ transform: 'translateX(100%)' }), // Empieza fuera de la vista, a la derecha
    animate('0.5s ease', style({ transform: 'translateX(0)' })) // Anima hacia la posición original
  ]),
  transition(':leave', [
    animate('0.5s ease', style({ transform: 'translateX(100%)' })) // Anima hacia fuera de la vista, a la derecha
  ])
]);

export const rotateInOut = trigger('rotateInOut', [
  transition(':enter', [
    style({ transform: 'rotate(-180deg)', opacity: 0 }), // Empieza rotado 180 grados y con opacidad 0
    animate('0.5s ease', style({ transform: 'rotate(0)', opacity: 1 })) // Anima hacia rotación 0 grados y opacidad 1
  ]),
  transition(':leave', [
    animate('0.5s ease', style({ transform: 'rotate(-180deg)', opacity: 0 })) // Anima hacia rotación -180 grados y opacidad 0
  ])
]);

// Fade and Scale In/Out
export const fadeScaleInOut = trigger('fadeScaleInOut', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.5)' }), // Empieza con opacidad 0 y escala 0.5
    animate('0.5s ease', style({ opacity: 1, transform: 'scale(1)' })) // Anima hacia opacidad 1 y escala 1
  ]),
  transition(':leave', [
    animate('0.5s ease', style({ opacity: 0, transform: 'scale(0.5)' })) // Anima hacia opacidad 0 y escala 0.5
  ])
]);

// Slide and Rotate In/Out
export const slideRotateInOut = trigger('slideRotateInOut', [
  transition(':enter', [
    style({ transform: 'translateX(-100%) rotate(-90deg)', opacity: 0 }), // Empieza fuera de la vista, rotado y con opacidad 0
    animate('0.5s ease', style({ transform: 'translateX(0) rotate(0)', opacity: 1 })) // Anima hacia la posición original, rotación 0 y opacidad 1
  ]),
  transition(':leave', [
    animate('0.5s ease', style({ transform: 'translateX(100%) rotate(90deg)', opacity: 0 })) // Anima hacia fuera de la vista, rotado y con opacidad 0
  ])
]);

// Bounce In/Out
export const bounceInOut = trigger('bounceInOut', [
  transition(':enter', [
    animate('0.5s ease', keyframes([
      style({ transform: 'scale(0.5)', offset: 0 }), // Empieza con escala 0.5
      style({ transform: 'scale(1.2)', offset: 0.5 }), // Rebota hacia escala 1.2
      style({ transform: 'scale(1)', offset: 1 }) // Termina en escala 1
    ]))
  ]),
  transition(':leave', [
    animate('0.5s ease', keyframes([
      style({ transform: 'scale(1)', offset: 0 }), // Empieza con escala 1
      style({ transform: 'scale(1.2)', offset: 0.5 }), // Rebota hacia escala 1.2
      style({ transform: 'scale(0.5)', offset: 1 }) // Termina en escala 0.5
    ]))
  ])
]);

// Flip In/Out
export const flipInOut = trigger('flipInOut', [
  transition(':enter', [
    style({ transform: 'rotateY(90deg)', opacity: 0 }), // Empieza rotado en el eje Y y con opacidad 0
    animate('0.5s ease', style({ transform: 'rotateY(0)', opacity: 1 })) // Anima hacia rotación 0 y opacidad 1
  ]),
  transition(':leave', [
    animate('0.5s ease', style({ transform: 'rotateY(90deg)', opacity: 0 })) // Anima hacia rotación 90 grados en el eje Y y opacidad 0
  ])
]);

// Zoom In/Out
export const zoomInOut = trigger('zoomInOut', [
  transition(':enter', [
    style({ transform: 'scale(0)', opacity: 0 }), // Empieza con escala 0 y opacidad 0
    animate('0.5s ease', style({ transform: 'scale(1)', opacity: 1 })) // Anima hacia escala 1 y opacidad 1
  ]),
  transition(':leave', [
    animate('0.5s ease', style({ transform: 'scale(0)', opacity: 0 })) // Anima hacia escala 0 y opacidad 0
  ])
]);

// Slide Down/Up
export const slideDownUp = trigger('slideDownUp', [
  transition(':enter', [
    style({ height: '0' }), // Empieza con altura 0
    animate('0.5s ease', style({ height: '*' })) // Anima hacia la altura original
  ]),
  transition(':leave', [
    animate('0.5s ease', style({ height: '0' })) // Anima hacia altura 0
  ])
]);

export const staggeredListAnimation = trigger('staggeredListAnimation', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(-20px)' }),
      stagger(100, [
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ], { optional: true }),
    query(':leave', [
      stagger(100, [
        animate('0.5s ease-out', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ], { optional: true })
  ])
]);
