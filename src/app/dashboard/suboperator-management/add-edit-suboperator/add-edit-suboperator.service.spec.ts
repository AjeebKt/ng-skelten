import { TestBed } from '@angular/core/testing';

import { AddEditSuboperatorService } from './add-edit-suboperator.service';

describe('AddEditSuboperatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AddEditSuboperatorService = TestBed.get(AddEditSuboperatorService);
    expect(service).toBeTruthy();
  });
});
