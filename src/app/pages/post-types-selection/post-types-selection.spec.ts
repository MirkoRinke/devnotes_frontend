import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostTypesSelection } from './post-types-selection';

describe('PostTypesSelection', () => {
  let component: PostTypesSelection;
  let fixture: ComponentFixture<PostTypesSelection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostTypesSelection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostTypesSelection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
