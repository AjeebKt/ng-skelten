import { TestBed } from '@angular/core/testing';

import { SuboperatorListService } from './suboperator-list.service';

describe('SuboperatorListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SuboperatorListService = TestBed.get(SuboperatorListService);
    expect(service).toBeTruthy();
  });
});
