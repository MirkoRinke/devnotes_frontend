import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCode } from './post-code';

describe('PostCode', () => {
  let component: PostCode;
  let fixture: ComponentFixture<PostCode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostCode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostCode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
