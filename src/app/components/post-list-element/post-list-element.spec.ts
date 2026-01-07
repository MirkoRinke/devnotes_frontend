import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostListElement } from './post-list-element';

describe('PostListElement', () => {
  let component: PostListElement;
  let fixture: ComponentFixture<PostListElement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostListElement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostListElement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
