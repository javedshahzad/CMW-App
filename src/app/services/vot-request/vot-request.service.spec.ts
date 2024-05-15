import { TestBed } from '@angular/core/testing';

import { VotRequestService } from './vot-request.service';

describe('VotRequestService', () => {
  let service: VotRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VotRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
