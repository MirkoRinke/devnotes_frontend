import { TestBed } from '@angular/core/testing';

import { AvailableValuesService } from './available-values.service';

describe('AvailableValuesService', () => {
  let service: AvailableValuesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvailableValuesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
