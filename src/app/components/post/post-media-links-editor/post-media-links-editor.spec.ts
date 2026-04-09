import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostMediaLinksEditor } from './post-media-links-editor';

describe('PostMediaLinksEditor', () => {
  let component: PostMediaLinksEditor;
  let fixture: ComponentFixture<PostMediaLinksEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostMediaLinksEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostMediaLinksEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
