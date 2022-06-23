import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavScrimComponent } from './sidenav-scrim.component';

describe('SidenavScrimComponent', () => {
  let component: SidenavScrimComponent;
  let fixture: ComponentFixture<SidenavScrimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidenavScrimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavScrimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
