import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserControlMenu } from './user-control-menu';

describe('UserControlMenu', () => {
  let component: UserControlMenu;
  let fixture: ComponentFixture<UserControlMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserControlMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserControlMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
