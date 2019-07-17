import { TestBed } from '@angular/core/testing';

import { RouteAccessGuardService } from './route-access-guard.service';

describe('RouteAccessGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RouteAccessGuardService = TestBed.get(RouteAccessGuardService);
    expect(service).toBeTruthy();
  });
});
