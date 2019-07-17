/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ForgotserviceService } from './forgotservice.service';

describe('Service: Forgotservice', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ForgotserviceService]
    });
  });

  it('should ...', inject([ForgotserviceService], (service: ForgotserviceService) => {
    expect(service).toBeTruthy();
  }));
});
