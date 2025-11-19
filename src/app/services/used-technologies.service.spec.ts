import { TestBed } from '@angular/core/testing';

import { UsedTechnologiesService } from './used-technologies.service';

describe('UsedTechnologiesService', () => {
  let service: UsedTechnologiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsedTechnologiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
