import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SidenavItem } from '../sidenav-item.model';

@Component({
  selector: 'apex-sidenav-dropdown-item',
  templateUrl: './sidenav-dropdown-item.component.html',
  encapsulation: ViewEncapsulation.None
})
export class SidenavDropdownItemComponent {
  @Input() items: SidenavItem[];
  @ViewChild('childMenu', {static: true}) childMenu;

  constructor(private router: Router, private route: ActivatedRoute) { }

  hasActiveChild(path) {
    if (!path) {
      return false;
    }
    return this.router.isActive(this.router.createUrlTree([path], { relativeTo: this.route }).toString(), false);
  }
}
