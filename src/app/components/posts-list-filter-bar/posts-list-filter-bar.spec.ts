import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsListFilterBar } from './posts-list-filter-bar';

describe('PostsListFilterBar', () => {
  let component: PostsListFilterBar;
  let fixture: ComponentFixture<PostsListFilterBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostsListFilterBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostsListFilterBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
