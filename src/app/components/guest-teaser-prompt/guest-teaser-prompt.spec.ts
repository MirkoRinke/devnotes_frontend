import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestTeaserPrompt } from './guest-teaser-prompt';

describe('GuestTeaserPrompt', () => {
  let component: GuestTeaserPrompt;
  let fixture: ComponentFixture<GuestTeaserPrompt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestTeaserPrompt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestTeaserPrompt);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
