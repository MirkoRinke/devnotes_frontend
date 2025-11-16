import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagePagination } from './page-pagination';

describe('PagePagination', () => {
  let component: PagePagination<any>;
  let fixture: ComponentFixture<PagePagination<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagePagination],
    }).compileComponents();

    fixture = TestBed.createComponent(PagePagination);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
