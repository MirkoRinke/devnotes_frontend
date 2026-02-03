import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBadgeMenu } from './user-badge-menu';

describe('UserBadgeMenu', () => {
  let component: UserBadgeMenu;
  let fixture: ComponentFixture<UserBadgeMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserBadgeMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserBadgeMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
