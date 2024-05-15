import { TestBed } from '@angular/core/testing';

import { LateInService } from './late-in.service';

describe('LateInService', () => {
  let service: LateInService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LateInService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
