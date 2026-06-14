import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Farewell } from './farewell';

describe('Farewell', () => {
  let component: Farewell;
  let fixture: ComponentFixture<Farewell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Farewell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Farewell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
