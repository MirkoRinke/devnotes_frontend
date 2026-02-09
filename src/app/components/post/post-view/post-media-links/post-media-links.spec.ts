import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostMediaLinks } from './post-media-links';

describe('PostMediaLinks', () => {
  let component: PostMediaLinks;
  let fixture: ComponentFixture<PostMediaLinks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostMediaLinks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostMediaLinks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
