import { Component, HostListener } from '@angular/core';
import { DrawerService } from '../drawer.service';

@Component({
  selector: 'apex-drawer-scrim',
  template: '',
  styleUrls: ['./drawer-scrim.component.scss']
})
export class DrawerScrimComponent {

  constructor(private drawerService: DrawerService) { }

  @HostListener('click')
  closeDrawer() {
    this.drawerService.setHideDrawer(true);
  }

  @HostListener('document:keydown.escape')
  onEscHandler() {
    this.drawerService.setHideDrawer(true);
  }

}
