/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AdminListService } from './admin-list.service';

describe('Service: AdminList', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminListService]
    });
  });

  it('should ...', inject([AdminListService], (service: AdminListService) => {
    expect(service).toBeTruthy();
  }));
});
