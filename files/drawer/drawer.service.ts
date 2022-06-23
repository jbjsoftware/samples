import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DrawerService {
  private handset = new BehaviorSubject<boolean>(false);
  handset$ = this.handset.asObservable();

  private tablet = new BehaviorSubject<boolean>(false);
  tablet$ = this.tablet.asObservable();

  private hideDrawer = new BehaviorSubject<boolean>(true);
  hideDrawer$ = this.hideDrawer.asObservable();

  setHandset(value: boolean) {
    this.handset.next(value);
  }

  getHandset() {
    return this.handset.value;
  }

  setTablet(value: boolean) {
    this.tablet.next(value);
  }

  getTablet() {
    return this.tablet.value;
  }

  setHideDrawer(value: boolean) {
    this.hideDrawer.next(value);
  }

  getHideDrawer() {
    return this.hideDrawer.value;
  }
}
