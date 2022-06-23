import { Component, Input, ViewEncapsulation } from '@angular/core';
import { SidenavItem } from '../sidenav-item.model';
import { Router, ActivatedRoute } from '@angular/router';
import { matExpansionAnimations } from '@angular/material/expansion';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SidenavService } from '../sidenav.service';

@Component({
  selector: 'apex-sidenav-collapse-item',
  templateUrl: './sidenav-collapse-item.component.html',
  encapsulation: ViewEncapsulation.None
})
export class SidenavCollapseItemComponent {
  @Input() items: SidenavItem[];
  @Input() level = 1;
}

@Component({
  selector: 'apex-sidenav-collapse-panel',
  templateUrl: './sidenav-collapse-panel.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: [
    matExpansionAnimations.indicatorRotate,
    trigger('bodyExpansion', [
      state('collapsed', style({ height: '0px', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')),
    ])
  ]
})
export class SidenavCollapsePanelComponent {
  @Input() item: SidenavItem;
  @Input() level = 1;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public sidenavService: SidenavService) { }

  hasActiveChild(path) {
    if (!path) {
      return false;
    }
    return this.router.isActive(this.router.createUrlTree([path], { relativeTo: this.route }).toString(), false);
  }
}
