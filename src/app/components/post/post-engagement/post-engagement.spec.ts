import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostEngagement } from './post-engagement';

describe('PostEngagement', () => {
  let component: PostEngagement;
  let fixture: ComponentFixture<PostEngagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostEngagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostEngagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
