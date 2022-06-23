import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LayoutModule } from '@angular/cdk/layout';

import { DrawerContainerComponent } from './drawer-container/drawer-container.component';
import { DrawerContentComponent } from './drawer-content/drawer-content.component';
import { DrawerComponent } from './drawer/drawer.component';
import { DrawerScrimComponent } from './drawer-scrim/drawer-scrim.component';
import { DrawerTogglerComponent } from './drawer-toggler/drawer-toggler.component';

@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    MatIconModule,
    MatButtonModule
  ],
  declarations: [
    DrawerContainerComponent,
    DrawerContentComponent,
    DrawerComponent,
    DrawerScrimComponent,
    DrawerTogglerComponent
  ],
  exports: [
    DrawerContainerComponent,
    DrawerContentComponent,
    DrawerComponent,
    DrawerScrimComponent,
    DrawerTogglerComponent
  ]
})
export class DrawerModule { }
