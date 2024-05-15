import { TestBed } from '@angular/core/testing';

import { FlexRequestService } from './flex-request.service';

describe('FlexRequestService', () => {
  let service: FlexRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlexRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
