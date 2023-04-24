import {
    trigger,
    transition,
    style,
    animate,
    animateChild,
    query,
  } from '@angular/animations';

  export const fade = trigger('fade', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('300ms ease', style({ opacity: 1 })),
    ]),
    transition(':leave', [
      style({ opacity: 1 }),
      animate('250ms ease', style({ opacity: 0 })),
    ]),
  ]);

  export const slide = trigger('slide', [
    transition(
      ':enter',
      [
        style({ transform: 'translateX({{ pixels }}px)', opacity: 1 }),
        animate(
          '{{ outSpeed }}ms 150ms ease',
          style({ transform: 'translateX(0px)', opacity: 1 })
        ),
        query(':enter', [animateChild()], { optional: true }),
      ],
      { params: { pixels: 400, outSpeed: 350, inSpeed: 250 } }
    ),
    transition(
      ':leave',
      [
        style({ transform: 'translateX(0px)', opacity: 1 }),
        animate(
          '{{ inSpeed }}ms ease',
          style({ transform: 'translateX({{ pixels }}px)', opacity: 1 })
        ),
      ],
      { params: { pixels: 400, outSpeed: 350, inSpeed: 250 } }
    ),
  ]);

  export const slideIn = [
    style({ transform: 'translateX(450px)', opacity: 0 }),
    animate(
      '350ms 150ms ease',
      style({ transform: 'translateX(0px)', opacity: 1 })
    ),
  ];

  export const slideOut = [
    style({ transform: 'translateX(0px)', opacity: 1 }),
    animate('250ms ease', style({ transform: 'translateX(450px)', opacity: 0 })),
  ];

  export const fadeIn = [
    style({
      transform: 'translate(-50%, -50%) scale(0.7, 0.7)',
      opacity: 0,
      top: '50%',
      left: '50%',
    }),
    animate(
      '350ms 150ms ease',
      style({
        transform: 'translate(-50%, -50%) scale(1, 1)',
        opacity: 1,
        top: '50%',
        left: '50%'
      })
    )
  ];

  export const fadeOut = [
    style({
      transform: 'translate(-50%, -50%) scale(1, 1)',
      opacity: 1,
      top: '50%',
      left: '50%',
    }),
    animate(
      '250ms ease',
      style({
        transform: 'translate(-50%, -50%) scale(0.7, 0.7)',
        opacity: 0,
        top: '50%',
        left: '50%'
      })
    )
  ];
