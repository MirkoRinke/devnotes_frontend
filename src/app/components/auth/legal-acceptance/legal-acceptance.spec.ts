import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalAcceptance } from './legal-acceptance';

describe('LegalAcceptance', () => {
  let component: LegalAcceptance;
  let fixture: ComponentFixture<LegalAcceptance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegalAcceptance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegalAcceptance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
