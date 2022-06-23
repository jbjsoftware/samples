import { Component, Input, OnInit } from '@angular/core';
import { SidenavService } from '../sidenav.service';

@Component({
  selector: 'apex-sidenav-toggler',
  templateUrl: './sidenav-toggler.component.html',
  styleUrls: ['./sidenav-toggler.component.scss']
})
export class SidenavTogglerComponent implements OnInit {
  @Input() icon = 'menu';
  @Input() expandedIcon = 'menu_open';
  @Input() mirror: boolean;

  constructor(private sidenavService: SidenavService) { }

  get isCollapsed() {
    return this.sidenavService.hideNav$;
  }

  ngOnInit() {
    this.expandedIcon = this.expandedIcon ? this.expandedIcon : this.icon;
  }

  toggleNav() {
    this.sidenavService.setHideNav(!this.sidenavService.getHideNav());
  }

}
