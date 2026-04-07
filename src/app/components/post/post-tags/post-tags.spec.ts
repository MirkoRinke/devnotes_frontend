import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostTags } from './post-tags';

describe('PostTags', () => {
  let component: PostTags;
  let fixture: ComponentFixture<PostTags>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostTags]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostTags);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
