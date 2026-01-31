import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostSettingsDropdown } from './post-settings-dropdown';

describe('PostSettingsDropdown', () => {
  let component: PostSettingsDropdown;
  let fixture: ComponentFixture<PostSettingsDropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostSettingsDropdown]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostSettingsDropdown);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
