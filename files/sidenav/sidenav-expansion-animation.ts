import {
    trigger,
    state,
    style,
    transition,
    animate
} from '@angular/animations';

export const sidenavExpansion = trigger('sidenavExpansion', [
    state('largeExpanded', style({ width: '{{expandedWidth}}' }), {
        params: { expandedWidth: '256px' }
    }),
    state('largeCollapsed', style({ width: '{{collapsedWidth}}' }), {
        params: { collapsedWidth: '0' }
    }),
    state('tabletExpanded', style({ width: '{{expandedWidth}}' }), {
        params: { expandedWidth: '256px' }
    }),
    state('tabletCollapsed', style({ width: '{{collapsedWidth}}' }), {
        params: { collapsedWidth: '0' }
    }),
    state('handsetExpanded', style({ width: '{{expandedWidth}}' }), {
        params: { expandedWidth: '256px' }
    }),
    state('handsetCollapsed', style({ width: '{{collapsedWidth}}' }), {
        params: { collapsedWidth: '0' }
    }),
    transition('largeExpanded <=> largeCollapsed', [
        animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)')
    ]),
    transition('tabletExpanded <=> tabletCollapsed', [
        animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)')
    ]),
    transition('handsetExpanded <=> handsetCollapsed', [
        animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)')
    ])
]);
