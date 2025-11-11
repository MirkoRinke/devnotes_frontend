import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechTile } from './tech-tile';

describe('TechTile', () => {
  let component: TechTile;
  let fixture: ComponentFixture<TechTile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechTile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechTile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
