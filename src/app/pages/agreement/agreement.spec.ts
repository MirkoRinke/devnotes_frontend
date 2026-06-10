import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Agreement } from './agreement';

describe('Agreement', () => {
  let component: Agreement;
  let fixture: ComponentFixture<Agreement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Agreement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Agreement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
