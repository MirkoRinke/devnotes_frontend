import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryParamsDropdown } from './query-params-dropdown';

describe('QueryParamsDropdown', () => {
  let component: QueryParamsDropdown;
  let fixture: ComponentFixture<QueryParamsDropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueryParamsDropdown]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueryParamsDropdown);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
