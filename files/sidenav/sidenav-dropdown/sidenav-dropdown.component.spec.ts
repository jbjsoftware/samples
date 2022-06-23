import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavDropdownComponent } from './sidenav-dropdown.component';

describe('SidenavDropdownComponent', () => {
  let component: SidenavDropdownComponent;
  let fixture: ComponentFixture<SidenavDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidenavDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
