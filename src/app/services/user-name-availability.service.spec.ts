import { TestBed } from '@angular/core/testing';

import { UserNameAvailabilityService } from './user-name-availability.service';

describe('UserNameAvailabilityService', () => {
  let service: UserNameAvailabilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserNameAvailabilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
