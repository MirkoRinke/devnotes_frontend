import { TestBed } from '@angular/core/testing';

import { RegistrationAvailabilityService } from './registration-availability.service';

describe('RegistrationAvailabilityService', () => {
  let service: RegistrationAvailabilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistrationAvailabilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
