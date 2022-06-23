import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavDropdownItemComponent } from './sidenav-dropdown-item.component';

describe('SidenavDropdownItemComponent', () => {
  let component: SidenavDropdownItemComponent;
  let fixture: ComponentFixture<SidenavDropdownItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidenavDropdownItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavDropdownItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
