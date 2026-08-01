import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountUpdateForm } from './account-update-form';

describe('AccountUpdateForm', () => {
  let component: AccountUpdateForm;
  let fixture: ComponentFixture<AccountUpdateForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountUpdateForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountUpdateForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
