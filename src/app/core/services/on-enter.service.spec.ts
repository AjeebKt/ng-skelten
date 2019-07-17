/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OnEnterService } from './on-enter.service';

describe('Service: OnEnter', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OnEnterService]
    });
  });

  it('should ...', inject([OnEnterService], (service: OnEnterService) => {
    expect(service).toBeTruthy();
  }));
});
