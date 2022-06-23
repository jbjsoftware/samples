import { Component, Input, ViewEncapsulation } from '@angular/core';
import { SidenavItem } from '../sidenav-item.model';
import { Observable } from 'rxjs';
import { SidenavMode } from '../models/sidenav-mode.enum';
import { SidenavService } from '../sidenav.service';

@Component({
  selector: 'apex-sidenav-list-item',
  templateUrl: './sidenav-list-item.component.html',
  encapsulation: ViewEncapsulation.None
})
export class SidenavListItemComponent {
  @Input() item: SidenavItem;
  mode$: Observable<SidenavMode>;
  hideNav$: Observable<boolean>;

  constructor(private sidenavService: SidenavService) {
    this.mode$ = this.sidenavService.mode$;
    this.hideNav$ = this.sidenavService.hideNav$;
  }
}
