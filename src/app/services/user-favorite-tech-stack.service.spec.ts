import { TestBed } from '@angular/core/testing';

import { UserFavoriteTechStackService } from './user-favorite-tech-stack.service';

describe('UserFavoriteTechStackService', () => {
  let service: UserFavoriteTechStackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserFavoriteTechStackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
