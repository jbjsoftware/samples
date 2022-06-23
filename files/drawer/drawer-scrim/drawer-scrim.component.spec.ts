import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerScrimComponent } from './drawer-scrim.component';

describe('DrawerScrimComponent', () => {
  let component: DrawerScrimComponent;
  let fixture: ComponentFixture<DrawerScrimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawerScrimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawerScrimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
