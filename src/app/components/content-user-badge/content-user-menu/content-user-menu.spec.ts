import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentUserMenu } from './content-user-menu';

describe('ContentUserMenu', () => {
  let component: ContentUserMenu;
  let fixture: ComponentFixture<ContentUserMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentUserMenu],
    }).compileComponents();

    fixture = TestBed.createComponent(ContentUserMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
