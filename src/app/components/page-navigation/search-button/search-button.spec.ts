import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchButton } from './search-button';

describe('SearchButton', () => {
  let component: SearchButton;
  let fixture: ComponentFixture<SearchButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
