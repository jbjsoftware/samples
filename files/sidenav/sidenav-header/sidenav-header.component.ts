import { Component, Input } from '@angular/core';

@Component({
  selector: 'apex-sidenav-header',
  templateUrl: './sidenav-header.component.html',
  styleUrls: ['./sidenav-header.component.scss']
})
export class SidenavHeaderComponent {
  @Input() applicationName: string;
  @Input() color = 'accent';
}
