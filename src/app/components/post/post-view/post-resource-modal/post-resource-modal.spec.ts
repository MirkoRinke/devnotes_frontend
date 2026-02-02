import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostResourceModal } from './post-resource-modal';

describe('PostResourceModal', () => {
  let component: PostResourceModal;
  let fixture: ComponentFixture<PostResourceModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostResourceModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostResourceModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
