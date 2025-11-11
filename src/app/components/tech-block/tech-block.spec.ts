import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechBlock } from './tech-block';

describe('TechBlock', () => {
  let component: TechBlock;
  let fixture: ComponentFixture<TechBlock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechBlock]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechBlock);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
