import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlUserBadge } from './control-user-badge';

describe('ControlUserBadge', () => {
  let component: ControlUserBadge;
  let fixture: ComponentFixture<ControlUserBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlUserBadge]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlUserBadge);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
