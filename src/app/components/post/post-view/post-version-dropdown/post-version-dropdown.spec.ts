import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostVersionDropdown } from './post-version-dropdown';

describe('PostVersionDropdown', () => {
  let component: PostVersionDropdown;
  let fixture: ComponentFixture<PostVersionDropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostVersionDropdown]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostVersionDropdown);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
