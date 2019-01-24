import {
  trigger,
  transition,
  style,
  animate,
  state
} from '@angular/animations';

export const expandCollapse = trigger('expandCollapse', [
  state('*', style({ 'overflow-y': 'hidden' })),
  state('void', style({ 'overflow-y': 'hidden' })),
  transition('* => void', [
    style({ height: '*' }),
    animate('550ms ease-out', style({ height: 0 }))
  ]),
  transition('void => *', [
    style({ height: 0 }),
    animate('550ms ease-in', style({ height: '*' }))
  ])
]);
