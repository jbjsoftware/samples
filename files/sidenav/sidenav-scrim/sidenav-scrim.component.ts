import { Component, HostListener } from '@angular/core';
import { SidenavService } from '../sidenav.service';

@Component({
  selector: 'apex-sidenav-scrim',
  template: '',
  styleUrls: ['./sidenav-scrim.component.scss']
})
export class SidenavScrimComponent {

  constructor(private sidenavService: SidenavService) { }

  @HostListener('click')
  closeSidenav() {
    this.sidenavService.setHideNav(true);
  }

  @HostListener('document:keydown.escape')
  onEscHandler() {
    this.sidenavService.setHideNav(true);
  }

}
