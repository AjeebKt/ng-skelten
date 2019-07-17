/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AddEditUserService } from './add-edit-user.service';

describe('Service: AddEditUser', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddEditUserService]
    });
  });

  it('should ...', inject([AddEditUserService], (service: AddEditUserService) => {
    expect(service).toBeTruthy();
  }));
});
