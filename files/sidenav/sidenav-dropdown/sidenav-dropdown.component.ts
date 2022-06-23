import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SidenavItem } from '../sidenav-item.model';
import { Observable } from 'rxjs';
import { SidenavMode } from '../models/sidenav-mode.enum';
import { SidenavService } from '../sidenav.service';

@Component({
  selector: 'apex-sidenav-dropdown',
  templateUrl: './sidenav-dropdown.component.html',
  encapsulation: ViewEncapsulation.None
})
export class SidenavDropdownComponent {
  @Input() item: SidenavItem;
  mode$: Observable<SidenavMode>;

  constructor(private router: Router, private route: ActivatedRoute, private sidenavService: SidenavService) {
    this.mode$ = this.sidenavService.mode$;
  }

  hasActiveChild(path) {
    if (!path) {
      return false;
    }
    return this.router.isActive(this.router.createUrlTree([path], { relativeTo: this.route }).toString(), false);
  }

}
