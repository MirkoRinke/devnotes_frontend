import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostDescription } from './post-description';

describe('PostDescription', () => {
  let component: PostDescription;
  let fixture: ComponentFixture<PostDescription>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostDescription]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostDescription);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
