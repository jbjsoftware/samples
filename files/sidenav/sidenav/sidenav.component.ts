import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subject, combineLatest } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

import { SidenavService } from '../sidenav.service';
import { SidenavItem } from '../sidenav-item.model';
import { SidenavMode } from '../models/sidenav-mode.enum';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { sidenavExpansion } from '../sidenav-expansion-animation';

@Component({
  selector: 'apex-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [sidenavExpansion],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[@sidenavExpansion]': '{value: sideNavState, params:{ expandedWidth: expandedWidth, collapsedWidth: collapsedWidth}}',
    '(@sidenavExpansion.done)': 'animationEnd$.next($event)',
    '[class.handset]': 'handset',
    '[class.tablet]': 'tablet',
    '[class.collapsed]': 'hideNav',
    '[class.condensed]': 'mode === "condensed"'
  }
})
export class SidenavComponent implements OnInit, OnDestroy {
  @Input() sideNavWidth = '256px';
  @Input() navItems: SidenavItem[];
  @Input() autoClose: boolean;
  @Input() collapsed: boolean;
  @Input() mode: SidenavMode = SidenavMode.collapse;
  @Input() autoExpandOnFullscreen: boolean;
  @Input() disableModal: boolean;
  private unsubscribe$ = new Subject<any>();
  animationEnd$ = new Subject<AnimationEvent>();
  handset$: Observable<boolean>;
  tablet$: Observable<boolean>;
  hideNav$: Observable<boolean>;
  handset: boolean;
  tablet: boolean;
  hideNav: boolean;
  expandedWidth = '256px';
  collapsedWidth = '0';
  sideNavState:
    'handsetExpanded' |
    'handsetCollapsed' |
    'tabletExpanded' |
    'tabletCollapsed' |
    'largeExpanded' |
    'largeCollapsed' = 'largeExpanded';

  constructor(
    private sidenavService: SidenavService,
    private breakpointObserver: BreakpointObserver,
    private router: Router) {
    this.handset$ = this.sidenavService.handset$;
    this.tablet$ = this.sidenavService.tablet$;
    this.hideNav$ = this.sidenavService.hideNav$;
  }

  ngOnInit() {
    this._observeBreakpoints();
    this._bindToRouterSubscription();

    this.sidenavService.setHideNav(this.collapsed);
    this.sidenavService.setMode(this.mode);

    combineLatest(
      this.sidenavService.hideNav$,
      this.sidenavService.handset$,
      this.sidenavService.tablet$
    )
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((result) => {
        this.hideNav = result[0],
          this.handset = result[1],
          this.tablet = result[2];

        if (this.handset) {
          this.sideNavState = this.hideNav ? 'handsetCollapsed' : 'handsetExpanded';
        } else if (this.tablet) {
          this.sideNavState = this.hideNav ? 'tabletCollapsed' : 'tabletExpanded';
        } else {
          this.sideNavState = this.hideNav ? 'largeCollapsed' : 'largeExpanded';
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.animationEnd$.complete();
  }

  private _observeBreakpoints() {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium])
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(results => {
        if (results.matches && results.breakpoints[Breakpoints.Medium]) {
          this.expandedWidth = this.sideNavWidth;
          this.collapsedWidth = this.mode === SidenavMode.condensed ? '70px' : '0';
          this.sidenavService.setHideNav(true);
          this.sidenavService.setTablet(true);
          this.sidenavService.setHandset(false);
        } else if (results.matches && results.breakpoints[Breakpoints.Small] && !this.disableModal) {
          this.expandedWidth = this.sideNavWidth;
          this.collapsedWidth = '0';
          this.sidenavService.setHideNav(true);
          this.sidenavService.setTablet(false);
          this.sidenavService.setHandset(true);
        } else if (results.matches && results.breakpoints[Breakpoints.XSmall] && !this.disableModal) {
          this.expandedWidth = '80%';
          this.collapsedWidth = '0';
          this.sidenavService.setHideNav(true);
          this.sidenavService.setTablet(false);
          this.sidenavService.setHandset(true);
        } else {
          this.expandedWidth = this.sideNavWidth;
          this.collapsedWidth = this.mode === SidenavMode.condensed ? '70px' : '0';
          this.sidenavService.setTablet(false);
          this.sidenavService.setHandset(false);
          this.sidenavService.setHideNav(coerceBooleanProperty(this.autoExpandOnFullscreen) ?
            false :
            this.sidenavService.getHideNav()
          );
        }
      });
  }


  private _bindToRouterSubscription() {
    this.router.events
      .pipe(
        takeUntil(this.unsubscribe$),
        filter(event => event instanceof NavigationStart)
      ).subscribe(() => {
        if (
          (this.sidenavService.getHandset() ||
            this.sidenavService.getTablet()) &&
          this.autoClose) {
          this.sidenavService.setHideNav(true);
        }
      });
  }

  closeSidenav() {
    this.sidenavService.setHideNav(true);
  }

}
