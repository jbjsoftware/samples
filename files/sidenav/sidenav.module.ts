import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LayoutModule } from '@angular/cdk/layout';
import { CdkAccordionModule } from '@angular/cdk/accordion';

import { SidenavContainerComponent } from './sidenav-container/sidenav-container.component';
import { SidenavContentComponent } from './sidenav-content/sidenav-content.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SidenavListComponent } from './sidenav-list/sidenav-list.component';
import { SidenavScrimComponent } from './sidenav-scrim/sidenav-scrim.component';
import { SidenavTogglerComponent } from './sidenav-toggler/sidenav-toggler.component';
import { SidenavListItemComponent } from './sidenav-list-item/sidenav-list-item.component';
import { SidenavCollapsePanelComponent, SidenavCollapseItemComponent } from './sidenav-collapse-panel/sidenav-collapse-panel.component';
// import { SidenavCollapseItemComponent } from './sidenav-collapse-item/sidenav-collapse-item.component';
import { SidenavDropdownComponent } from './sidenav-dropdown/sidenav-dropdown.component';
import { SidenavDropdownItemComponent } from './sidenav-dropdown-item/sidenav-dropdown-item.component';
import { SidenavHeaderComponent } from './sidenav-header/sidenav-header.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    LayoutModule,
    CdkAccordionModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatTooltipModule,
    MatRippleModule,
    MatMenuModule,
    MatToolbarModule
  ],
  declarations: [
    SidenavContainerComponent,
    SidenavContentComponent,
    SidenavComponent,
    SidenavListComponent,
    SidenavScrimComponent,
    SidenavTogglerComponent,
    SidenavListItemComponent,
    SidenavCollapsePanelComponent,
    SidenavCollapseItemComponent,
    SidenavDropdownComponent,
    SidenavDropdownItemComponent,
    SidenavHeaderComponent
  ],
  exports: [
    SidenavContainerComponent,
    SidenavContentComponent,
    SidenavComponent,
    SidenavListComponent,
    SidenavScrimComponent,
    SidenavTogglerComponent,
    SidenavListItemComponent,
    SidenavCollapsePanelComponent,
    SidenavCollapseItemComponent,
    SidenavDropdownComponent,
    SidenavDropdownItemComponent,
    SidenavHeaderComponent
  ]
})
export class SidenavModule { }
