import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalMobile } from './legal-mobile';

describe('LegalMobile', () => {
  let component: LegalMobile;
  let fixture: ComponentFixture<LegalMobile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegalMobile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegalMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
