import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MvpPill } from './mvp-pill';

describe('MvpPill', () => {
  let component: MvpPill;
  let fixture: ComponentFixture<MvpPill>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MvpPill]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MvpPill);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
