import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordStrengthFeedback } from './password-strength-feedback';

describe('PasswordStrengthFeedback', () => {
  let component: PasswordStrengthFeedback;
  let fixture: ComponentFixture<PasswordStrengthFeedback>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordStrengthFeedback]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordStrengthFeedback);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
