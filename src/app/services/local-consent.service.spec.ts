import { TestBed } from '@angular/core/testing';

import { LocalConsentService } from './local-consent.service';

describe('LocalConsentService', () => {
  let service: LocalConsentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalConsentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
