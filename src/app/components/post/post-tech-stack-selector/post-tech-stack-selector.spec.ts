import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostTechStackSelector } from './post-tech-stack-selector';

describe('PostTechStackSelector', () => {
  let component: PostTechStackSelector;
  let fixture: ComponentFixture<PostTechStackSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostTechStackSelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostTechStackSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
