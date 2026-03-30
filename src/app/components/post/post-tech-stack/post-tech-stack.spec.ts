import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostTechStack } from './post-tech-stack';

describe('PostTechStack', () => {
  let component: PostTechStack;
  let fixture: ComponentFixture<PostTechStack>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostTechStack]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostTechStack);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
