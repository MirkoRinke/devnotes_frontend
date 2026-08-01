import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlUserMenu } from './control-user-menu';

describe('ControlUserMenu', () => {
  let component: ControlUserMenu;
  let fixture: ComponentFixture<ControlUserMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlUserMenu],
    }).compileComponents();

    fixture = TestBed.createComponent(ControlUserMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
