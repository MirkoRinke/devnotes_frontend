import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritesRefreshButton } from './favorites-refresh-button';

describe('FavoritesRefreshButton', () => {
  let component: FavoritesRefreshButton;
  let fixture: ComponentFixture<FavoritesRefreshButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoritesRefreshButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoritesRefreshButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
