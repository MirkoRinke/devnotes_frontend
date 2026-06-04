import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Goodbye } from './goodbye';

describe('Goodbye', () => {
  let component: Goodbye;
  let fixture: ComponentFixture<Goodbye>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Goodbye]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Goodbye);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
