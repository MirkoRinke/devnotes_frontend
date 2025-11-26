import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryParamsDatepicker } from './query-params-datepicker';

describe('QueryParamsDatepicker', () => {
  let component: QueryParamsDatepicker;
  let fixture: ComponentFixture<QueryParamsDatepicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueryParamsDatepicker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueryParamsDatepicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
