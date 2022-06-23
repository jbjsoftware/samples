import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';

export const drawerExpansion = trigger('drawerExpansion', [
  state('largeExpanded', style({ width: '{{expandedWidth}}' }), {
    params: { expandedWidth: '320px' }
  }),
  state('largeCollapsed', style({ width: '0', display: 'none' })),
  state('tabletExpanded', style({ width: '{{expandedWidth}}' }), {
    params: { expandedWidth: '320px' }
  }),
   state('tabletCollapsed', style({ width: '0', display: 'none' })),
  state('handsetExpanded', style({ width: '{{expandedWidth}}' }), {
    params: { expandedWidth: '80%' }
  }),
   state('handsetCollapsed', style({ width: '0', display: 'none' })),
  transition('largeCollapsed => largeExpanded, tabletCollapsed => tabletExpanded, handsetCollapsed => handsetExpanded', [
    style({ display: 'flex' }),
    animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')
  ]),
  transition('largeExpanded => largeCollapsed, tabletExpanded => tabletCollapsed, handsetExpanded => handsetCollapsed', [
    animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ width: '0px', display: 'none' }))
  ])
]);
