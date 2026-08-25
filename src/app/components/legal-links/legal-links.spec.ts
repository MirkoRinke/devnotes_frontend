import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalLinks } from './legal-links';

describe('LegalLinks', () => {
  let component: LegalLinks;
  let fixture: ComponentFixture<LegalLinks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegalLinks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegalLinks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
