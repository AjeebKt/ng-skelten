/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AddEditGroupService } from './add-edit-group.service';

describe('Service: AddEditGroup', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddEditGroupService]
    });
  });

  it('should ...', inject([AddEditGroupService], (service: AddEditGroupService) => {
    expect(service).toBeTruthy();
  }));
});
