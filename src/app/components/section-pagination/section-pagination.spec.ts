import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionPagination } from './section-pagination';

describe('SectionPagination', () => {
  let component: SectionPagination<any>;
  let fixture: ComponentFixture<SectionPagination<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionPagination],
    }).compileComponents();

    fixture = TestBed.createComponent(SectionPagination);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
