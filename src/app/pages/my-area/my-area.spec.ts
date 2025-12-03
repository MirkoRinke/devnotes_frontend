import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyArea } from './my-area';

describe('MyArea', () => {
  let component: MyArea;
  let fixture: ComponentFixture<MyArea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyArea]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyArea);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
