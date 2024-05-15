import { TestBed } from '@angular/core/testing';

import { CallInRequestService } from './call-in-request.service';

describe('CallInRequestService', () => {
  let service: CallInRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CallInRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
