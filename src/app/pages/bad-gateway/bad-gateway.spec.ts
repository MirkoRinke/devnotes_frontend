import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadGateway } from './bad-gateway';

describe('BadGateway', () => {
  let component: BadGateway;
  let fixture: ComponentFixture<BadGateway>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadGateway]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BadGateway);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
