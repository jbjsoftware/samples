import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavCollapsePanelComponent } from './sidenav-collapse-panel.component';

describe('SidenavCollapsePanelComponent', () => {
  let component: SidenavCollapsePanelComponent;
  let fixture: ComponentFixture<SidenavCollapsePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidenavCollapsePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavCollapsePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
