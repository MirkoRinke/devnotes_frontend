import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAccountForm } from './delete-account-form';

describe('DeleteAccountForm', () => {
  let component: DeleteAccountForm;
  let fixture: ComponentFixture<DeleteAccountForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteAccountForm],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteAccountForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
