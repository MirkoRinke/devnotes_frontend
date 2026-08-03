import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionStepper } from './section-stepper';

describe('SectionStepper', () => {
  let component: SectionStepper;
  let fixture: ComponentFixture<SectionStepper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionStepper],
    }).compileComponents();

    fixture = TestBed.createComponent(SectionStepper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
