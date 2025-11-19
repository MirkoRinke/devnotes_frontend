import { TestBed } from '@angular/core/testing';

import { UserFavoriteTechnologiesService } from './user-favorite-technologies.service';

describe('UserFavoriteTechnologiesService', () => {
  let service: UserFavoriteTechnologiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserFavoriteTechnologiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
