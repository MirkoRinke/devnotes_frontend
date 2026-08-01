import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlGuestActions } from './control-guest-actions';

describe('ControlGuestActions', () => {
  let component: ControlGuestActions;
  let fixture: ComponentFixture<ControlGuestActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlGuestActions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlGuestActions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
