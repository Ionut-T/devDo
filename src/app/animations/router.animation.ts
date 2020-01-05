import { AnimationTriggerMetadata, trigger, animate, transition, style, query, group } from '@angular/animations';

const slideToTheRight = [
  query(
    ':enter, :leave',
    [
      style({
        position: 'absolute',
        top: document.body.clientWidth <= 599 ? '56px' : '64px',
        right: 0,
        width: '100%'
      })
    ],
    { optional: true }
  ),
  query(':enter', [style({ right: '-100%' })]),
  group([
    query(':leave', [animate('.6s ease', style({ right: '100%' }))], { optional: true }),
    query(':enter', [animate('.6s ease', style({ right: '0%' }))])
  ])
];

const slideToTheLeft = [
  query(
    ':enter, :leave',
    [
      style({
        position: 'absolute',
        top: document.body.clientWidth <= 599 ? '56px' : '64px',
        left: 0,
        width: '100%'
      })
    ],
    { optional: true }
  ),
  query(':enter', [style({ left: '-100%' })]),
  group([
    query(':leave', [animate('.6s ease', style({ left: '100%' }))], { optional: true }),
    query(':enter', [animate('.6s ease', style({ left: '0%' }))])
  ])
];

export const routerAnimation: AnimationTriggerMetadata = trigger('routerAnimation', [
  transition('* => isLeft', slideToTheLeft),
  transition('* => isRight', slideToTheRight),
  transition('isRight => *', slideToTheLeft),
  transition('isLeft => *', slideToTheRight)
]);
