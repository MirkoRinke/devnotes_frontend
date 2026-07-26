import { TestBed } from '@angular/core/testing';

import { UserControlRefreshService } from './user-control-refresh.service';

describe('UserControlRefreshService', () => {
  let service: UserControlRefreshService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserControlRefreshService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
