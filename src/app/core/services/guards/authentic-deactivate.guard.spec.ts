import { TestBed, async, inject } from '@angular/core/testing';

import { AuthenticDeactivateGuard } from './authentic-deactivate.guard';

describe('AuthenticDeactivateGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthenticDeactivateGuard]
    });
  });

  it('should ...', inject([AuthenticDeactivateGuard], (guard: AuthenticDeactivateGuard) => {
    expect(guard).toBeTruthy();
  }));
});
