import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordToggleButton } from './password-toggle-button';

describe('PasswordToggleButton', () => {
  let component: PasswordToggleButton;
  let fixture: ComponentFixture<PasswordToggleButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordToggleButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordToggleButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
