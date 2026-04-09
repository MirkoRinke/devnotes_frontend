import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostTagsEditor } from './post-tags-editor';

describe('PostTagsEditor', () => {
  let component: PostTagsEditor;
  let fixture: ComponentFixture<PostTagsEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostTagsEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostTagsEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
