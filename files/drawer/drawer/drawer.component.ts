import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DrawerService } from '../drawer.service';
import { Observable, combineLatest, Subject } from 'rxjs';
import { drawerExpansion } from '../drawer-expansion-animation';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'apex-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
  providers: [DrawerService],
  animations: [drawerExpansion],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[@drawerExpansion]': '{value: drawerState, params:{ expandedWidth: expandedWidth}}',
    '(@drawerExpansion.done)': 'animationEnd$.next($event)',
    '[class.small-screen]': 'handset || tablet',
    '[class.collapsed]': 'hideDrawer',
    '[class.position-start]': 'position === "start"',
    '[class.position-end]': 'position === "end"',
  }
})
export class DrawerComponent implements OnInit, OnDestroy {
  @Input() drawerWidth = '320px';
  @Input() collapsed = true;
  @Input() autoExpandOnFullscreen: boolean;
  private unsubscribe$ = new Subject<any>();
  animationEnd$ = new Subject<AnimationEvent>();
  handset$: Observable<boolean>;
  tablet$: Observable<boolean>;
  hideDrawer$: Observable<boolean>;
  handset: boolean;
  tablet: boolean;
  hideDrawer: boolean;
  expandedWidth = '320px';
  drawerState:
    'handsetExpanded' |
    'handsetCollapsed' |
    'tabletExpanded' |
    'tabletCollapsed' |
    'largeExpanded' |
    'largeCollapsed' = 'largeExpanded';

  @Input()
  get position(): 'start' | 'end' { return this._position; }
  set position(value: 'start' | 'end') {
    value = value === 'end' ? 'end' : 'start';
    if (value !== this._position) {
      this._position = value;
    }
  }
  private _position: 'start' | 'end' = 'end';

  constructor(
    public drawerService: DrawerService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.handset$ = this.drawerService.handset$;
    this.tablet$ = this.drawerService.tablet$;
    this.hideDrawer$ = this.drawerService.hideDrawer$;
  }

  ngOnInit() {
    this._observeBreakpoints();

    this.drawerService.setHideDrawer(coerceBooleanProperty(this.collapsed));

    combineLatest([
      this.drawerService.hideDrawer$,
      this.drawerService.handset$,
      this.drawerService.tablet$]
    )
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((result) => {
        this.hideDrawer = result[0];
        this.handset = result[1];
        this.tablet = result[2];

        if (this.handset) {
          this.drawerState = this.hideDrawer ? 'handsetCollapsed' : 'handsetExpanded';
        } else if (this.tablet) {
          this.drawerState = this.hideDrawer ? 'tabletCollapsed' : 'tabletExpanded';
        } else {
          this.drawerState = this.hideDrawer ? 'largeCollapsed' : 'largeExpanded';
        }
      });
  }

  ngOnDestroy() {
    this.animationEnd$.complete();
    this.unsubscribe$.next();
  }

  setCollapsed(value: boolean) {
    this.drawerService.setHideDrawer(value);
  }

  closeDrawer() {
    this.drawerService.setHideDrawer(true);
  }

  toggleDrawer() {
    this.drawerService.setHideDrawer(!this.drawerService.getHideDrawer());
  }

  private _observeBreakpoints() {
    // if smallscreen always collapse on load
    const collapsed = JSON.parse(JSON.stringify(this.collapsed));
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(results => {
        this.collapsed = true;
        if (results.matches &&
          (results.breakpoints[Breakpoints.Small])) {
          this.drawerService.setHideDrawer(true);
          this.drawerService.setTablet(true);
          this.drawerService.setHandset(false);
          this.expandedWidth = this.drawerWidth;
        } else if (results.matches && results.breakpoints[Breakpoints.XSmall]) {
          this.drawerService.setHideDrawer(true);
          this.drawerService.setTablet(false);
          this.drawerService.setHandset(true);
          this.expandedWidth = '80%';
        } else {
          this.collapsed = collapsed;
          this.drawerService.setTablet(false);
          this.drawerService.setHandset(false);
          this.expandedWidth = this.drawerWidth;
          this.drawerService.setHideDrawer(coerceBooleanProperty(this.autoExpandOnFullscreen) ?
            false :
            this.drawerService.getHideDrawer()
          );
        }
      });
  }

}
