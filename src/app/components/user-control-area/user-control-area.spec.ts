import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserControlArea } from './user-control-area';

describe('UserControlArea', () => {
  let component: UserControlArea;
  let fixture: ComponentFixture<UserControlArea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserControlArea]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserControlArea);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
