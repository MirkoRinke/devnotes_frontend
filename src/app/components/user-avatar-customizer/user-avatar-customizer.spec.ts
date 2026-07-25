import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAvatarCustomizer } from './user-avatar-customizer';

describe('UserAvatarCustomizer', () => {
  let component: UserAvatarCustomizer;
  let fixture: ComponentFixture<UserAvatarCustomizer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAvatarCustomizer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAvatarCustomizer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
