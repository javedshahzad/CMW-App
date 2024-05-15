import { TestBed } from '@angular/core/testing';

import { EarlyOutService } from './early-out.service';

describe('EarlyOutService', () => {
  let service: EarlyOutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EarlyOutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
