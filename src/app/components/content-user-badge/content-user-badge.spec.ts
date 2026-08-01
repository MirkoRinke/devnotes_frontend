import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentUserBadge } from './content-user-badge';

describe('ContentUserBadge', () => {
  let component: ContentUserBadge;
  let fixture: ComponentFixture<ContentUserBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentUserBadge],
    }).compileComponents();

    fixture = TestBed.createComponent(ContentUserBadge);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
