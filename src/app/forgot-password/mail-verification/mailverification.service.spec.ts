/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MailverificationService } from './mailverification.service';

describe('Service: Mailverification', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MailverificationService]
    });
  });

  it('should ...', inject([MailverificationService], (service: MailverificationService) => {
    expect(service).toBeTruthy();
  }));
});
