import { Component, Input, ViewEncapsulation } from '@angular/core';
import { SidenavItem } from '../sidenav-item.model';
import { SidenavService } from '../sidenav.service';
import { Observable } from 'rxjs';
import { SidenavMode } from '../models/sidenav-mode.enum';

@Component({
  selector: 'apex-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidenavListComponent {
  @Input() navItems: SidenavItem[];
  handset$: Observable<boolean>;
  hideNav$: Observable<boolean>;
  mode$: Observable<SidenavMode>;

  constructor(private sidenavService: SidenavService) {
    this.handset$ = this.sidenavService.handset$;
    this.hideNav$ = this.sidenavService.hideNav$;
    this.mode$ = this.sidenavService.mode$;
  }
}
