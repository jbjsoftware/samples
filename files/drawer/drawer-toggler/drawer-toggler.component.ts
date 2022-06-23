import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { DrawerComponent } from '../drawer/drawer.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'apex-drawer-toggler',
  templateUrl: './drawer-toggler.component.html',
  styleUrls: ['./drawer-toggler.component.scss'],
  host: {
    '[class.expanded]': '!isCollapsed'
  }
})
export class DrawerTogglerComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<any>();
  @Input() icon = 'menu';
  @Input() expandedIcon: string;
  @Input() drawer: DrawerComponent;
  @Input() color = null;
  @Input() mirror: boolean;
  isCollapsed: boolean;

  ngOnInit() {
    this.expandedIcon = this.expandedIcon ? this.expandedIcon : this.icon;

    this.drawer.hideDrawer$
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(
        collapsed => this.isCollapsed = collapsed
      );
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
  }

  toggleDrawer() {
    if (this.drawer) {
      this.drawer.toggleDrawer();
    } else {
      alert('Toggler requires an apex-drawer to be passed in.');
    }
  }

}
