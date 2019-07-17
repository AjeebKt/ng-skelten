/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AddEditAdminService } from './add-edit-admin.service';

describe('Service: AddEditAdmin', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddEditAdminService]
    });
  });

  it('should ...', inject([AddEditAdminService], (service: AddEditAdminService) => {
    expect(service).toBeTruthy();
  }));
});
