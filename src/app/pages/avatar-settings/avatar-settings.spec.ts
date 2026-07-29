import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarSettings } from './avatar-settings';

describe('AvatarSettings', () => {
  let component: AvatarSettings;
  let fixture: ComponentFixture<AvatarSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvatarSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
