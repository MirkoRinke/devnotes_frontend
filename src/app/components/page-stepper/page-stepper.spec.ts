import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageStepper } from './page-stepper';

describe('PageStepper', () => {
  let component: PageStepper;
  let fixture: ComponentFixture<PageStepper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageStepper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageStepper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
