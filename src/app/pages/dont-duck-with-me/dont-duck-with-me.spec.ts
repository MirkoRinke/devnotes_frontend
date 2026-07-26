import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DontDuckWithMe } from './dont-duck-with-me';

describe('DontDuckWithMe', () => {
  let component: DontDuckWithMe;
  let fixture: ComponentFixture<DontDuckWithMe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DontDuckWithMe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DontDuckWithMe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
