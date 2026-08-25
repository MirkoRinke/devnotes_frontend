import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorLinks } from './creator-links';

describe('CreatorLinks', () => {
  let component: CreatorLinks;
  let fixture: ComponentFixture<CreatorLinks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatorLinks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatorLinks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
