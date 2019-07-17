/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GroupListService } from './group-list.service';

describe('Service: GroupList', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GroupListService]
    });
  });

  it('should ...', inject([GroupListService], (service: GroupListService) => {
    expect(service).toBeTruthy();
  }));
});
