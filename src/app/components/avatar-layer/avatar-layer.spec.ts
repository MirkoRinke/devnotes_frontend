import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarLayer } from './avatar-layer';

describe('AvatarLayer', () => {
  let component: AvatarLayer;
  let fixture: ComponentFixture<AvatarLayer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarLayer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvatarLayer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
